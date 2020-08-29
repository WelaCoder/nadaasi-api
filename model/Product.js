const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
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
  reviews: [
    {
      name: { type: String },
      text: { type: String },
      detail: { type: String },
      rating: { type: Number },
      date: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  price: {
    type: String,
    required: true,
  },
  dressType: {
    type: String,
    required: true,
  },
  dressSize: [
    {
      type: String,
      required: true,
    },
  ],
  bodyType: [
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
});
module.exports = Product = mongoose.model("product", ProductSchema);
