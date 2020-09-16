const router = require("express").Router();
const upload = require("../upload");
const User = require("../model/User");
const auth = require("../middleware/auth");
const Coupon = require("../model/Coupon");

router.post("/applyCoupon/", auth, async (req, res) => {
  try {
    // let testimonials = await Review.find({ rating: 5 });
    let user = await User.findById(req.user.id);
    let coupon = null;
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
      await user.save();
    }
    // console.log(coupon);
    res.json({ coupon });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});
module.exports = router;
