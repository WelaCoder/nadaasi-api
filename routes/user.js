const express = require("express");
const bcrypt = require("bcryptjs");
const config = require("config");
const jwt = require("jsonwebtoken");
const { check, validationResult } = require("express-validator");

const User = require("../model/User");

const auth = require("../middleware/auth");
const verify = require("../middleware/check");
const couponCodeGenerator = require("../utils/couponCodeGenerator");

const router = express.Router();

router.post(
  "/signup",
  [
    check("firstname", "Firstname is required").not().isEmpty(),
    check("lastname", "Lastname is required").not().isEmpty(),
    check("email", "Email is required").isEmail(),
    check("password", "Password is required").isLength({ min: 6 }),
  ],
  async (req, res) => {
    console.log(req.body);
    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res.status(400).json({
        error: error.array(),
      });
    }
    const { firstname, lastname, inviteCode, email, password } = req.body;
    let code = couponCodeGenerator();
    console.log(code);
    let user;
    try {
      // finding exsisting USers
      user = await User.findOne({ email });
      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: "User already exists" }] });
      }
      // Registring USers
      if (inviteCode && inviteCode != "") {
        let vouchers = [
          {
            code: couponCodeGenerator(),
            discount: 20,
            used: false,
            isActive: true,
            discountType: "pi",
          },
        ];
        let inviter = await User.find({ inviteCode: inviteCode });
        let activites = [
          {
            text: `You registered with ${inviter.firstname + " " + inviter.lastname + "'s"
              } invite code and received a 20% discount voucher.`,
          },
        ];
        console.log(inviter);
        inviter[0].activities.push({
          text: `Your friend ${firstname + " " + lastname
            } registered with your invite code and received a 20% discount voucher.`,
        });
        user = new User({
          firstname,
          lastname,
          vouchers,
          email,
          inviter: {
            _id: inviter[0]._id,
            rewarded: false,
          },
          activites,
          password,
          inviteCode: code,
        });
        await inviter[0].save();
      } else {
        user = new User({
          firstname,
          lastname,
          email,
          password,
          inviteCode: code,
        });
      }
      console.log("object");
      const salt = await bcrypt.genSalt(10);
      console.log("object");
      user.password = await bcrypt.hash(password, salt);
      // saving user in database
      await user.save();

      // return jwt token

      payload = {
        user: {
          id: user.id,
          admin: false,
        },
      };
      jwt.sign(
        payload,
        config.get("jwtsecret"),
        {
          expiresIn: "364d",
        },
        (error, token) => {
          if (error) throw error;
          res.json({
            token,
          });
        }
      );
    } catch (error) {
      console.error(error);
      return res.status(500).send("Server error");
    }
  }
);
router.post(
  "/login",
  [
    check("email", "Email is required").isEmail(),
    check("password", "Password is required").isLength({ min: 6 }),
  ],
  async (req, res) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res.status(400).json({
        error: error.array(),
      });
    }
    const { email, password } = req.body;
    let user;
    try {
      user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ msg: "Invalid Credentials" });
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ msg: "Invalid Credentials" });
      }
      payload = {
        user: {
          id: user.id,
          admin: false,
        },
      };
      jwt.sign(
        payload,
        config.get("jwtsecret"),
        {
          expiresIn: "364d",
        },
        (error, token) => {
          if (error) throw error;
          res.json({
            token,
          });
        }
      );
    } catch (error) {
      console.error(error);
      return res.status(500).send("Server error");
    }
  }
);

router.put("/setBodyType", auth, verify.notAdmin, async (req, res) => {
  try {
    console.log(req.body);
    const user = await User.findById(req.user.id).select("-password");
    user.bodyType = req.body.bodyType;
    await user.save();
    res.json(user);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Server Error" });
  }
});

router.put("/setCountry", auth, verify.notAdmin, async (req, res) => {
  try {
    console.log(req.body);
    const user = await User.findById(req.user.id).select("-password");
    user.country = req.body.country;

    await user.save();
    res.json(user);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Server Error" });
  }
});

router.get("/", auth, verify.notAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Server Error" });
  }
});
module.exports = router;
