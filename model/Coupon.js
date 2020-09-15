const mongoose = require("mongoose");
const coupon = require("../utils/couponCodeGenerator");
const couponSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  code: {
    type: String,
    unique: true,
    required: true,
  },
  discount: {
    required: true,
    type: Number,
  },
  discountType: {
    required: true,
    type: String,
  },
  amount: {
    type: Number,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = User = mongoose.model("coupon", couponSchema);
