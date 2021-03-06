const express = require("express");
const app = express();
var fs = require("fs");
var cors = require("cors");
const connectDB = require("./config/db");

const PORT = process.env.PORT || 3001;
// app.use(cors());
connectDB();
app.use(cors());
app.get("/uploads/:file", (req, res) => {
  res.sendFile(__dirname + "/client/public/uploads/" + req.params.file);
});
app.get("/payment", (req, res) => {
  fs.writeFile("mynewfile3.html", "req.body.html", function (err) {
    if (err) throw err;
    console.log("Saved!");
  });

  return res.sendFile(__dirname + "/mynewfile3.html");
});

app.get('/html', (req, res) => {
  return res.sendFile('views/order.html', { root: __dirname });
});

app.use(express.json({ extended: true }));
app.use("/api/user", require("./routes/user"));
app.use("/api/product", require("./routes/product"));
app.use("/api/cart", require("./routes/cart"));
app.use("/api/payment", require("./routes/payment"));
app.use("/api/order", require("./routes/order"));
app.use("/api/testimonial", require("./routes/testimonial"));
app.use("/api/shipping", require("./routes/shipping"));
app.use('/api/admin', require('./routes/admin'));
app.use("/api/voucher", require("./routes/voucher"));
app.use("/api/coupon", require("./routes/coupon"));
app.use('/api/feedback', require('./routes/feedback'));
app.use('/api/merchantreturn', require('./routes/return'))
app.use('/api/dressType', require('./routes/dressType'))
app.use('/api/verify', require('./routes/verify'))
app.use('/api/manufacturer', require('./routes/manufacturer'))



app.listen(PORT, () => {
  console.log(`Your Server is runing on ${PORT} port `);
});
