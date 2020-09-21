const router = require("express").Router();
const upload = require("../upload");
const User = require("../model/User");
const auth = require("../middleware/auth");
const Coupon = require("../model/Coupon");
const config = require("config");
const mailer = require('../config/mailer');
router.get("/", auth, async (req, res) => {
    try {
        var user = await User.findById(req.user.id);
        console.log(user.email);
        await mailer.sendMail(
            {
                from: "info@nadaasi.com",
                to: user.email,
                subject: "Verify Email Address",
                text:
                    // ''
                    `click the link below to verify your email address
                ${req.protocol + "://" + req.headers.host}/api/verify/` +
                    user._id +
                    "/"

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





module.exports = router;
