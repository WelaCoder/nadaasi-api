const mongoose = require("mongoose");

const shippingSchema = new mongoose.Schema({
  standardCost: {
    type: Number,
    default: 200,
  },
  fastCost: {
    type: Number,
    required: 200,
  },

  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = User = mongoose.model("shipping", shippingSchema);
