const mongoose = require("mongoose");
const coupon = require("../utils/couponCodeGenerator");
const UserSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: true,
  },
  bodyType: {
    type: String,
    default: ""
  },

  lastname: {
    type: String,
    required: true,
  },
  balance: {
    type: Number,
    default: 0,
  },
  Usedcoupon: [ {
    couponCode: {
      type: String,
  },
  isUsed: {
      type: Boolean,
      default : false
  }
  }],
  appliedCoupon: {
    name: {
      type: String,
    },
    code: {
      type: String,
    },
    isUsed: {
      type : Boolean
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
    amount: {
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

    // unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  orderId: {
    type: String,
    default: "",
  },
  country: {
    name: {
      type: String,

    }
    , code: {
      type: String,
    }
  },
  address: {

    type: String,

  },
  date: {
    type: Date,
    default: Date.now,
  },
  admin: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: false
  }
});

module.exports = User = mongoose.model("user", UserSchema);
