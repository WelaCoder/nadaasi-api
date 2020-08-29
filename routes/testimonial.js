const router = require("express").Router();
const upload = require("../upload");
const Review = require("../model/Review");

router.get("/", async (req, res) => {
  try {
    let testimonials = await Review.find({ rating: 5 });
    res.json({ testimonials: testimonials.reverse() });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});
module.exports = router;
