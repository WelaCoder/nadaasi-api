const router = require("express").Router();
const upload = require("../upload");
const CartItem = require("../model/CartItem");
const Product = require("../model/Product");
const User = require("../model/User");
const auth = require("../middleware/auth");

router.post("/", upload.array("images", 3), auth, async (req, res) => {
  try {
    console.log(req.body);
    var images = [];
    let product = await Product.findById(req.body._id);
    let cartItem = await CartItem.create({
      user: req.user.id,
      color: req.body.color,
      size: req.body.size,
      product,
      details: product,
      unit: (req.body.unit),
      quantity: Number(req.body.quantity),
      neck: Number(req.body.neck),
      overBust: Number(req.body.overBust),
      bust: Number(req.body.bust),
      vNeckCut: Number(req.body.vNeckCut),
      wrist: Number(req.body.wrist),
      foreArm: Number(req.body.foreArm),
      bicep: Number(req.body.bicep),
      aboveKneeToAnkle: Number(req.body.aboveKneeToAnkle),
      armHole: Number(req.body.armHole),
      shoulderSeam: Number(req.body.shoulderSeam),
      armLength: Number(req.body.armLength),
      aboveKneeToAnkle: Number(req.body.aboveKneeToAnkle),
      neckToAboveHeel: Number(req.body.neckToAboveHeel),
      neckToHeel: Number(req.body.neckToHeel),
      hips: Number(req.body.hips),
      waist: Number(req.body.waist),
      underBust: Number(req.body.underBust),
      hip: Number(req.body.hip),
      waistToAboveKnee: Number(req.body.waistToAboveKnee),
      hip: Number(req.body.hip),
    });

    res.json({ message: "added item to cart", cartItem });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ msg: "internal server error" });
  }
});
router.put("/", auth, async (req, res) => {
  try {
    // return console.log(req.body.cart[0].product._id);
    let cartItems = await CartItem.find({ user: req.user.id }).populate(
      "product"
    );
    for (let index = 0; index < req.body.cart.length; index++) {
      const item = req.body.cart[index];
      let found = false;
      for (let index = 0; index < cartItems.length; index++) {
        const element = cartItems[index];
        if (element.product._id == item.product._id) {
          // console.log('found');
          found = true;
          break;
        }
      }
      if (!found) {
        // console.log('not found');
        let product = await Product.findById(item.product._id);
        let cartItem = await CartItem.create({
          user: req.user.id,
          color: item.color,
          size: item.size,
          product,
          details: product,
          unit: (item.unit),
          quantity: Number(item.quantity),
          neck: Number(item.neck),
          overBust: Number(item.overBust),
          bust: Number(item.bust),
          vNeckCut: Number(item.vNeckCut),
          wrist: Number(item.wrist),
          foreArm: Number(item.foreArm),
          bicep: Number(item.bicep),
          aboveKneeToAnkle: Number(item.aboveKneeToAnkle),
          armHole: Number(item.armHole),
          shoulderSeam: Number(item.shoulderSeam),
          armLength: Number(item.armLength),
          aboveKneeToAnkle: Number(item.aboveKneeToAnkle),
          neckToAboveHeel: Number(item.neckToAboveHeel),
          neckToHeel: Number(item.neckToHeel),
          hips: Number(item.hips),
          waist: Number(item.waist),
          underBust: Number(item.underBust),
          hip: Number(item.hip),
          waistToAboveKnee: Number(item.waistToAboveKnee),
          hip: Number(item.hip),
        });
        // console.log(cartItem);
      }
    }
    cartItems = await CartItem.find({ user: req.user.id }).populate(
      "product"
    );
    // console.log(cartItems.length);
    // console.log(cartItems);
    res.json({ cartItems });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    let cartItem = await CartItem.findByIdAndDelete(req.params.id);
    console.log(cartItem);
    res.json({ cartItem });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/:id/updateQuantity", async (req, res) => {
  try {
    let cartItem = await CartItem.findById(req.params.id).populate("product");
    cartItem.quantity = req.body.quantity;
    console.log(cartItem);
    await cartItem.save();
    res.json({ cartItem });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});
module.exports = router;
