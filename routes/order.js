const router = require("express").Router();
const config = require("config");
const KlarnaV3 = require("@crystallize/node-klarna/v3");

const Product = require("../model/Product");
const Order = require("../model/Order");
const auth = require("../middleware/auth");
const Review = require("../model/Review");
const User = require("../model/User");
const verify = require("../middleware/verify");

// router.post("/", upload.array("images", 3), async (req, res) => {
//   try {

//   } catch (error) {
//     console.log(error.message);
//     res.status(500).json({ msg: "internal server error" });
//   }
// });
router.get("/", auth, async (req, res) => {
  try {
    let orders = await Order.find({
      user: req.user.id,
    });
    let placedOrders = [];
    const client = new KlarnaV3({
      testDrive: true,
      username: config.get("klarnaUsername"),
      password: config.get("klarnaPassword"),
    });
    for (let index = 0; index < orders.length; index++) {
      const element = orders[index];
      if (element.isPlaced) {
        placedOrders.push(element);
      } else {
        const res = await client.getOrder(element.orderId);
        const { success, order } = res;
        console.log("in get order");
        console.log(res);
        if (success) {
          let user = await User.findById(req.user.id);
          if (element.coupon) {
            for (let index = 0; index < user.vouchers.length; index++) {
              const voucher = user.vouchers[index];
              if (voucher.code == element.coupon.code) {
                console.log(element.coupon);

                user.vouchers[index].used = true;
                user.vouchers[index].isActive = false;
              }
            }
          }
          let points = 0;
          for (let index = 0; index < element.products.length; index++) {
            const orderProduct = element.products[index];
            points += orderProduct.quantity;
          }
          user.points += points;
          user.activities.push({
            text: `Your earned ${points} points for purchasing ${points} dresses.`,
          });
          user.balance -= element.balanceDiscount;
          // console.log(order);
          const { acknowledgeOrderSuccess } = await client.acknowledgeOrder(
            element.orderId
          );
          const captureOrder = await client.captureOrder(
            element.orderId
          );
          if (user.inviter._id) {
            if (!user.inviter.rewarded) {
              let inviter = await User.findById(user.inviter._id);
              inviter.balance += 20;
              inviter.activities.push({
                text: `Your friend ${user.firstname + " " + user.lastname
                  } made his first purchase and you received 20€.`,
              });
              await inviter.save();
              user.inviter.rewarded = true;
            }
          }
          await user.save();
          placedOrders.push(element);
          element.isPlaced = true;
          element.isAcknowledged = true;
          await element.save();
        } else {
          await Order.findByIdAndDelete(element._id);
        }
      }
    }

    // console.log(placedOrders);
    res.json({ orders: placedOrders.reverse() });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});
router.get("/admin", auth, verify.isAdmin, async (req, res) => {
  try {
    const order = await Order.find();
    res.json(order);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Server error");
  }
});
router.get("/:id", auth, async (req, res) => {
  try {
    let order = await Order.findById(req.params.id);

    // console.log(placedOrders);
    res.json({ order });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});
router.post("/:id/rateProduct/:productId", auth, async (req, res) => {
  try {
    let order = await Order.findById(req.params.id);
    let product = null;
    for (let index = 0; index < order.products.length; index++) {
      const element = order.products[index];
      if (element.details._id == req.params.productId) {
        product = index;
      }
    }
    console.log("rating object");
    if (product != null) {
      console.log(product);
      order.rated[product] = true;
      await order.save();

      product = await Product.findById(req.params.productId);
      let user = await User.findById(req.user.id);
      let review = await Review.create({
        ...req.body,
        name: user.firstname + " " + user.lastname,
        image: product.images[0],
      });

      product.reviews.push(review);

      // console.log(product);
      let rating = 0;
      for (let index = 0; index < product.reviews.length; index++) {
        const productReview = product.reviews[index];
        rating += Number(productReview.rating);
      }
      rating = rating / product.reviews.length;
      console.log(rating);
      console.log(product.reviews);
      product.rating = Number(rating.toString().split(".")[0]);
      await product.save();

      // order = await Order.findByIdAndUpdate(order);
      // console.log(order.products[product].details.rated);
      console.log(order);
      let theOrder = await Order.findByIdAndUpdate(order._id, order);
      console.log(theOrder);
      console.log("completed");
    }

    // console.log(req.params.productId);
    // console.log(order.products[0].details._id);
    // console.log(order);
    // console.log(placedOrders);
    res.json({ order });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});
router.post("/:id/captureOrder", auth, verify.isAdmin, async (req, res) => {
  try {

    let order = await Order.findById(req.params.id);

    order.status = req.body.status
    await order.save();

    res.json(order);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});
module.exports = router;
