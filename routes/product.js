const router = require("express").Router();
const upload = require("../upload");
const Product = require("../model/Product");
const auth = require("../middleware/auth");
const verify = require("../middleware/verify");
router.post("/", upload.array("images", 3), async (req, res) => {
  try {
    var images = [];
    for (let index = 0; index < req.files.length; index++) {
      const element = req.files[index].filename;
      images.push(element);
    }
    console.log(req.body);
    product = await Product.create({
      images: images,
      modelHeightSize: req.body.modelHeightSize,
      details: req.body.details,
      waistLine: req.body.waistline,
      neckLine: req.body.neckline,
      length: req.body.length,
      fabric: req.body.fabric,
      closure: req.body.closure,
      dressType: req.body.dressType,
      price: req.body.price,
      name: req.body.name,
      dressColor: req.body.color.split(","),
      dressSize: req.body.size.split(","),
      bodyType: req.body.bodyType.split(","),
      rating: 5,
    });
    res.json({ product });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ msg: "internal server error" });
  }
});
router.get("/", async (req, res) => {
  try {
    let products = await Product.find({});
    res.json({ products: products.reverse() });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});
router.put("/:id", auth, verify.isAdmin, async (req, res) => {
  try {
    let product = await Product.findById(req.params.id);
    product.inStock = req.body.inStock;
    await product.save();

    res.json({ product });
  } catch (error) {
    console.error(error);
    return res.status(500).send("Server error");
  }
});
router.get("/:id", auth, verify.isAdmin, async (req, res) => {
  try {
    let product = await Product.findById(req.params.id);
    res.json(product);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Server error");
  }
});
module.exports = router;
