const Product = require("./model/Review");
const mailer = require('./config/mailer');
const verifymail = require("./config/verifymail");
const orderDetails = require("./config/orderDetails");
module.exports = async () => {
    console.log("seeding Database");
    // for (let index = 0; index < 50; index++) {
    //   const element = await Product.create({
    //     images: ["1598002071931.jpeg"],
    //     modelHeightSize: "23",
    //     details: "Seed Dress Evening",
    //     waistLine: "43",
    //     neckLine: "23",
    //     length: "23",
    //     fabric: "fabric",
    //     closure: "closure",
    //     dressType: "evening",
    //     price: (index + 1).toString(),
    //     name: "Seed Dress",
    //     dressColor: ["#aa3c3c"],
    //     dressSize: ["XS"],
    //     rating: 5,
    //   });
    //   console.log(element);
    // }
    // let products = await Product.find({});
    // for (let index = 0; index < products.length; index++) {
    //   const element = products[index];
    //   await Product.findByIdAndDelete(element._id);
    //   console.log(element);
    // // }
    // await mailer.sendMail(
    //     {

    //         from: "info@nadaasi.com",
    //         to: 'geekykoder@gmail.com',
    //         subject: "Verify Email Address",

    //         html: orderDetails(),

    //     },
    // );
    console.log("finished seeding");
};
