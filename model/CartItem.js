const mongoose = require("mongoose");

const CartItemSchema = new mongoose.Schema({
  size: {
    type: String,
    // required: true,
  },
  product: { type: mongoose.Schema.Types.ObjectId, ref: "product" },
  details: {
    _id: {
      type: String,
      required: true,
    },
    rated: {
      type: Boolean,
      default: false,
    },
    images: [
      {
        type: String,
        required: true,
      },
    ],
    name: {
      type: String,
      required: true,
    },
    price: {
      type: String,
      required: true,
    },
    dressType: {
      type: String,
      required: true,
    },
    originalPrice: {
      type: Number,
    },
    sale: {
      type: Boolean,
      default: false,
    },
    dressSize: [
      {
        type: String,
        required: true,
      },
    ],
    dressColor: [
      {
        type: String,
        required: true,
      },
    ],
    closure: {
      type: String,
      required: true,
    },
    fabric: {
      type: String,
      required: true,
    },
    length: {
      type: String,
      required: true,
    },
    neckLine: {
      type: String,
      required: true,
    },
    waistLine: {
      type: String,
      required: true,
    },
    details: {
      type: String,
      required: true,
    },
    modelHeightSize: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
    },
  },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
  unit: {
    type: String,
  },
  color: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
  },
  neck: {
    type: String,
  },
  bust: {
    type: String,
  },
  overBust: {
    type: String,
  },
  underBust: {
    type: String,
  },
  hips: {
    type: String,
  },
  neckToHeel: {
    type: String,
  },
  neckToAboveHeel: {
    type: String,
  },
  aboveKneeToAnkle: {
    type: String,
  },
  armLength: {
    type: String,
  },
  shoulderSeam: {
    type: String,
  },
  armHole: {
    type: String,
  },
  bicep: {
    type: String,
  },
  foreArm: {
    type: String,
  },
  wrist: {
    type: String,
  },
  vNeckCut: {
    type: String,
  },
  shoulderToWaist: {
    type: String,
  },
  waistToAboveKnee: {
    type: String,
  },
  hip: {
    type: String,
  },
});

module.exports = CartItem = mongoose.model("cartItem", CartItemSchema);
