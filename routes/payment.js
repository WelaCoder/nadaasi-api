//
const express = require("express");
const fs = require("fs");
const router = express.Router();
const KlarnaV3 = require("@crystallize/node-klarna/v3");
const auth = require("../middleware/auth");
const CartItem = require("../model/CartItem");
const Order = require("../model/Order");
const User = require("../model/User");
const Shipping = require("../model/Shipping");
const config = require("config");
// Initiate the client

router.post("/", auth, async (req, res) => {
  try {
    let cart = await CartItem.find({ user: req.user.id }).populate("product");
    let shipping = await Shipping.find({});
    let user = await User.findById(req.user.id);
    console.log(user.appliedCoupon);
    let discountAmount = 0;
    let units = 0;
    shipping = shipping[0];
    let totalAmount = 0;
    let shippingCost =
      req.body.shipping == "standard"
        ? shipping.standardCost
        : shipping.fastCost;
    let lines = cart.map((c) => {
      totalAmount +=
        Number(c.quantity) *
        (Number(c.product.price) * 100 +
          Number(c.product.price) * 100 * (24 / 100));
      return c;
    });
    if (req.body.useBalance) {
      console.log("useBalance");
      let userBalance = user.balance;

      if (userBalance * 100 >= totalAmount) {
        discountAmount = totalAmount;
      } else {
        discountAmount = userBalance * 100;
      }
    } else if (req.body.appliedCoupon) {
      if (user.appliedCoupon.isActive) {
        switch (user.appliedCoupon.discountType) {
          case "pi":
            cart.map((c) => {
              discountAmount +=
                Number(c.quantity) *
                (Number(c.product.price) *
                  (user.appliedCoupon.discount / 100)) *
                100;
              return c;
            });
            break;

          default:
            break;
        }
        console.log(discountAmount);
      }
    }
    // console.log(discountAmount);
    // console.log(discountAmount / units);

    const client = new KlarnaV3({
      testDrive: true,
      username: "PK06420_1338d8456309",
      password: "jxgy2sGZnnLR7cuu",
    });
    // console.log(shipping);
    // console.log(shippingCost);
    console.log(totalAmount);
    totalAmount -= discountAmount;
    totalAmount += shippingCost * 100;
    const { success, error, order } = await client.createOrder({
      purchase_country: req.body.country.code,
      purchase_currency: "EUR",
      locale: "en-GB",
      order_amount: totalAmount,
      order_tax_amount: 0,
      order_lines: [
        {
          type: "physical",
          reference: "19-402-USA",
          name: "Total Order",
          quantity: 1,
          quantity_unit: "pcs",
          unit_price: totalAmount,
          tax_rate: 0,
          total_amount: totalAmount,
          total_discount_amount: 0,
          total_tax_amount: 0,
        },
      ],

      merchant_urls: {
        terms: "https://www.example.com/terms.html",
        checkout: "https://www.example.com/checkout.html",
        confirmation: config.get("client") + "/user",
        push: "https://www.example.com/api/push",
      },
    });
    if (success) {
      // console.log(cart[0]);
      let userOrder = await Order.create({
        user: req.user.id,
        products: cart.map((c) => {
          return c;
        }),
        orderId: order.order_id,
        amount: totalAmount / 100,
        email: req.body.email,
        country: req.body.country,
        postalCode: req.body.postalCode,
        message: req.body.message,
        town: req.body.town,
        address: req.body.address,
        shipping: req.body.shipping,
        balanceDiscount: req.body.useBalance ? discountAmount / 100 : 0,
        coupon: user.appliedCoupon,
      });
      cart.forEach(async (c) => {
        await CartItem.findByIdAndDelete(c._id);
      });
      // // // console.log(userOrder.products);
      fs.writeFile(
        "routes/views/" + req.user.id.toString() + ".html",
        order.html_snippet,
        function (err) {
          if (err) return console.log(err);
        }
      );
    }
    console.log(success);
    // console.log(error);
    res.json({ success });
  } catch (error) {
    console.log(error);
  }
});

// router.get("/confirmation/:orderId", async (req, res) => {
//   const client = new KlarnaV3({
//     testDrive: true,
//     username: "PK06420_1338d8456309",
//     password: "jxgy2sGZnnLR7cuu",
//   });
//   console.log(req.params.orderId);
//   var order = await client.getOrder(req.params.orderId);
//   // order = await client.acknowledgeOrder(req.params.orderId);
//   order = await client.captureOrder(req.params.orderId);

//   console.log(order);
// });
router.get("/:userId", async (req, res) => {
  // let user = await User.findById(req.user.id);
  res.sendFile(__dirname + "/views/" + req.params.userId + ".html");
});
module.exports = router;
