const router = require("express").Router();
const upload = require("../upload");
const User = require("../model/User");
const auth = require("../middleware/auth");
const Coupon = require("../model/Coupon");
const config = require("config");
const mailer = require('../config/mailer');
const verifymail = require("../config/verifymail");
router.get("/", auth, async (req, res) => {
    try {
        var user = await User.findById(req.user.id);
        console.log(user.email);
        let verifyLink = `${req.protocol + "://" + req.headers.host}/api/verify/` +
            user._id +
            "/";
        await mailer.sendMail(
            {
                from: "info@nadaasi.com",
                to: user.email,
                subject: "Verify Email Address",
                html: verifymail(verifyLink),

            },
        );
        console.log('sent email');
        res.json(200);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});



router.get("/:id", async (req, res) => {
    try {
        var user = await User.findById(req.params.id);
        user.isActive = true;
        await user.save();
        res.redirect(config.get("client"));
        console.log('user verified');
        // res.json(200);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

router.get("/:id/delete", async (req, res) => {
    try {
        var user = await User.findById(req.params.id);
        await user.deleteOne();
        res.redirect(config.get("client"));
        console.log('user deleted');
        // res.json(200);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});




module.exports = router;
