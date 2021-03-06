//
const express = require("express");
const fs = require("fs");
const router = express.Router();
const KlarnaV3 = require("@crystallize/node-klarna/v3");
const auth = require("../middleware/auth");
const CartItem = require("../model/CartItem");
const Order = require("../model/Order");
const AppliedCoupon = require("../model/AppliedCoupon")
const User = require("../model/User");
const Shipping = require("../model/Shipping");
const config = require("config");
// Initiate the client

router.post("/", auth, async (req, res) => {
  try {
    let applidcoupon
    let cart = await CartItem.find({ user: req.user.id }).populate("product");
    let shipping = await Shipping.find({});
    
    let user = await User.findById(req.user.id);
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
        (Number(c.product.price) * 100);
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
      // console.log('object')
      console.log(req.body.appliedCoupon)
      
      
      applidcoupon = user.Usedcoupon.filter(coupon => coupon.couponCode === user.appliedCoupon.code )
      
        
      console.log(applidcoupon)
      // console.log(object)
      if (user.appliedCoupon.isActive) {
        
        
        discountAmount = 0;
        let appliedCoupon = user.appliedCoupon;
        let units = 0;
        for (let index = 0; index < cart.length; index++) {
          const cartProduct = cart[index];
          units += cartProduct.quantity;
        }
        switch (appliedCoupon.discountType) {
          case 'di':
            
            discountAmount = units * appliedCoupon.discount;
            break;
            case 'pi':
              discountAmount = 0;
              for (let index = 0; index < cart.length; index++) {
                const cartProduct = cart[index];
                discountAmount += (cartProduct.details.price * appliedCoupon.discount / 100) * cartProduct.quantity
              }
              break;
              case 'fs':
                discountAmount = 0;
                shippingCost = 0;
                break;
                case 'dst':
                  case 'dt':
                    discountAmount = appliedCoupon.discount;
                    break;
                    default:
                      discountAmount = 0;
                      break;
                    }
                    discountAmount = discountAmount * 100;
                    
                    console.log(discountAmount);
                  }else{
                    return console.log('coupon is already used')
                  }
                } else if (req.body.usePoints) {
                  let units = 0;
                  for (let index = 0; index < cart.length; index++) {
                    const cartProduct = cart[index];
                    units += cartProduct.quantity;
                  }
                  if ((units * 5) <= user.points) {
                    discountAmount = totalAmount
                  } else {
                    return console.log('balance not enough');
                  }
                }
                // console.log(discountAmount);
                // console.log(discountAmount / units);
                
                const client = new KlarnaV3({
                testDrive: config.get("testDrive"),
                username: config.get("klarnaUsername"),
                password: config.get("klarnaPassword"),
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
        discount: discountAmount / 100,
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
    console.log(error);
    if (applidcoupon[0]) {
      if (applidcoupon[0].isUsed === false) {
        console.log("123")
        console.log(user.Usedcoupon)
        const removeIndex = user.Usedcoupon.findIndex(coupon => coupon.couponCode === user.appliedCoupon.code)
    console.log('object')
        user.Usedcoupon.splice(removeIndex, 1);
        newcoupon = {
          isUsed: true,
          couponCode : user.appliedCoupon.code
        }
        user.Usedcoupon.push(newcoupon)
        console.log(user.Usedcoupon)
        user.save();
    // console.log(object)
    // await app.save()
      }
    }
    // console.log(object)
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
