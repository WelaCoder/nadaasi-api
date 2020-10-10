const router = require("express").Router();
const upload = require("../upload");
const Product = require("../model/Product");
const DressType = require("../model/DressType");
const auth = require("../middleware/auth");
const verify = require("../middleware/verify");
router.post("/", upload.array("images", 10), async (req, res) => {
  try {
    var dressType = await DressType.findOne({ value: req.body.dressType });
    console.log(dressType);
    if (dressType == null) {
      await DressType.create({ label: req.body.dressType, value: req.body.dressType })
    }
    var images = [];
    for (let index = 0; index < req.files.length; index++) {
      const element = req.files[index].filename;
      images.push(element);
    }
    // console.log(req.body);
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
      originalPrice: req.body.price,
      name: req.body.name,
      stock: req.body.stock == null || req.body.stock == 'null' ? 0 : req.body.stock,
      inStock: req.body.inStock,
      useStock: req.body.stock != "" && req.body.stock != 'null' && req.body.stock != null,
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



router.post("/:id", upload.array("images", 10), async (req, res) => {
  try {
    var dressType = await DressType.findOne({ value: req.body.dressType });
    console.log(req.body.stock == null || req.body.stock == 'null' ? 'tre' : 'false');
    if (dressType == null) {
      await DressType.create({ label: req.body.dressType, value: req.body.dressType })
    }
    var images = [];
    for (let index = 0; index < req.files.length; index++) {
      const element = req.files[index].filename;
      images.push(element);
    }
    // console.log(req.body);
    // console.log(images);
    let product = await Product.findById(req.params.id);
    if (images.length == 0) {
      images = product.images;
    }
    product = await Product.findByIdAndUpdate(req.params.id, {
      modelHeightSize: req.body.modelHeightSize,
      details: req.body.details,
      waistLine: req.body.waistline,
      neckLine: req.body.neckline,
      length: req.body.length,
      fabric: req.body.fabric,
      closure: req.body.closure,
      dressType: req.body.dressType,
      price: req.body.price,
      originalPrice: req.body.price,
      name: req.body.name,
      stock: req.body.stock == null || req.body.stock == 'null' ? 0 : req.body.stock,
      inStock: req.body.inStock,
      useStock: req.body.stock != "" && req.body.stock != 'null' && req.body.stock != null,
      dressColor: req.body.color.split(","),
      dressSize: req.body.size.split(","),
      bodyType: req.body.bodyType.split(","),
      rating: 5,
    });
    res.json({});

  } catch (error) {
    console.log(error.message);
    res.status(500).json({ msg: "internal server error" });
  }
});
router.get("/", async (req, res) => {
  try {
    let products = await Product.find({ inStock: true });
    let i = 0;
    products.map(p => p.inStock ? i++ : i = i);
    console.log(i);
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
