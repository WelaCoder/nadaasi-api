const router = require("express").Router();
const upload = require("../upload");
const User = require("../model/User");
const auth = require("../middleware/auth");
const Coupon = require("../model/Coupon");
const AppliedCoupon = require("../model/AppliedCoupon")
const couponCodeGenerator = require("../utils/couponCodeGenerator");

router.post("/applyCoupon/", auth, async (req, res) => {
  try {
    // let testimonials = await Review.find({ rating: 5 });
    let user = await User.findById(req.user.id);
    let coupon = null;
    let appliedCoupon
    let app;
    let id;
    for (let index = 0; index < user.vouchers.length; index++) {
      const voucher = user.vouchers[index];
      if (voucher.code == req.body.code && voucher.isActive) {
        console.log(voucher.code);
        coupon = voucher;
        coupon.id = index;
      }
    }
    if (coupon) {
      user.appliedCoupon = { ...coupon, id };

      await user.save();
    } else {
      coupon = await Coupon.findOne({ code: req.body.code });
      console.log(coupon);
      user.appliedCoupon = {
        isActive: coupon.isActive,
        name: coupon.name,
        code: coupon.code,
        discount: coupon.discount,
        discountType: coupon.discountType,
        id: null
      };
      
      
      // appliedCoupon = await User.findOne({ user: req.user.id })
      console.log(user)
      if (user.Usedcoupon.length > 0) {
        console.log('12')
         app = user.Usedcoupon.filter(coupon => coupon.couponCode === req.body.code)
        console.log('object')
        console.log(app)
        if (app.length === 0) {
          newcoupon = {
            couponCode : req.body.code
          }
          user.Usedcoupon.push(newcoupon)
          app = user.Usedcoupon.filter(coupon => coupon.couponCode === req.body.code)
          console.log(user)
      }
      } else {
        newcoupon = {
          couponCode : req.body.code
        }
        user.Usedcoupon.push(newcoupon)
        app = user.Usedcoupon.filter(coupon => coupon.couponCode === req.body.code)
      }
      // if (!appliedCoupon) {
      //   appliedCoupon = new AppliedCoupon({
      //     user: req.user.id,
      //     couponCode : req.body.code
      //   })
      // }
      // console.log(appliedCoupon);
      
      await user.save();
      if (app[0].isUsed === true) {
        console.log('ture')
        return res.json({ isUsed : true ,coupon  })
      } else {
        return res.json({isUsed : false ,coupon})
      }
    }
    // console.log(coupon);
    return res.json({coupon})
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});


router.get("/", auth, async (req, res) => {
  try {
    let user = await User.findById(req.user.id);
    if (s >= 3) {
      user.vouchers.push({
        code: couponCodeGenerator(),
        discount: 100,
        used: false,
        isActive: true,
        discountType: "dt",
      });
      user.activities.push({
        text: `You received a 100€ discount voucher.`,
      });
      user.points = user.points - 3;
    } else {
      return res.status(500).json({ message: "Internal Server Error" });
    }
    await user.save();
    res.json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});



module.exports = router;
