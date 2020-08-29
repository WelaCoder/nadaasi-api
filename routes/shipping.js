const router = require("express").Router();
const upload = require("../upload");
const Shipping = require("../model/Shipping");

router.get("/", async (req, res) => {
  try {
    let shippings = await Shipping.find({});
    if (shippings.length < 1) {
      Shipping.create({ standardCost: 200, fastCost: 400 });
    }

    shippings = await Shipping.find({});
    res.json({ shipping: shippings[0] });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});
module.exports = router;
