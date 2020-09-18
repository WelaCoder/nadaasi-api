const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: true,
  },
  products: [],
  rated: [
    {
      type: Boolean,
      default: false,
    },
  ],
  country: {
    code: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
  },
  email: {
    type: String,
  },
  isPlaced: {
    type: Boolean,
  },
  isAcknowledged: {
    type: Boolean,
  },
  status: {
    type: String,
    default: "Accepted",
  },
  town: {
    type: String,
  },
  message: {
    type: String,
  },
  postalCode: {
    type: String,
  },
  address: {
    type: String,
    required: true,
  },

  amount: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  shipping: {
    type: String,
    default: "standard",
  },
  balanceDiscount: {
    type: Number,
    default: 0,
  },
  discount: {
    type: Number,
    default: 0,
  },
  coupon: {
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
  user: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
});

module.exports = Order = mongoose.model("order", OrderSchema);
