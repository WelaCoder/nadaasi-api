const mongoose = require("mongoose");
const coupon = require("../utils/couponCodeGenerator");
const UserSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  balance: {
    type: Number,
    default: 0,
  },
  appliedCoupon: {
    code: {
      type: String,
    },
    id: {
      type: Number,
    },
    _id: {
      type: String,
    },
    discountType: {
      type: String,
    },
    discount: {
      type: Number,
    },
    isActive: {
      type: Boolean,
    },
  },
  points: {
    type: Number,
    default: 0,
  },
  inviter: {
    _id: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    rewarded: {
      type: Boolean,
      default: false,
    },
  },
  vouchers: [
    {
      code: {
        type: String,
        required: true,
      },
      discount: {
        type: Number,
      },
      discountType: {
        type: String,
      },
      amount: {
        type: Number,
      },
      isActive: {
        type: Boolean,
        default: true,
      },
    },
  ],
  activities: [
    {
      text: {
        type: String,
        required: true,
      },

      dated: {
        type: Date,
        default: new Date(Date.now()),
      },
    },
  ],
  email: {
    type: String,
    required: true,
    unique: true,
  },
  inviteCode: {
    type: String,
    default: coupon(),
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  orderId: {
    type: String,
    default: "",
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = User = mongoose.model("user", UserSchema);
