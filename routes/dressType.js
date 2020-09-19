const express = require('express');
const router = express.Router();

const DressType = require('../model/DressType');

const auth = require('../middleware/auth');
const verify = require('../middleware/verify');
const check = require('../middleware/check');
const Product = require('../model/Product');



router.get('/', async (req, res) => {
    try {
        const dresstype = await DressType.find().sort({ date: -1 });
        res.json(dresstype);
    } catch (error) {
        console.error(error);
        return res.status(500).send('Server error');
    }
});

router.put('/', auth, async (req, res) => {
    try {
        console.log(req.body);
        const dresstype = await DressType.findOne({ label: req.body.label });
        let products = await Product.find({ dressType: req.body.label });
        if (req.body.sale) {
            for (let index = 0; index < products.length; index++) {
                const product = products[index];
                product.sale = req.body.sale;
                product.originalPrice = Number(product.price);
                product.price = Number(product.price - (product.price * Number(req.body.discount) / 100));
                await product.save();
            }
            console.log(products);
        } else {
            for (let index = 0; index < products.length; index++) {
                const product = products[index];
                product.sale = req.body.sale;
                product.price = Number(product.originalPrice || product.price);
                await product.save();
            }

        }
        dresstype.sale = req.body.sale;
        dresstype.discount = req.body.discount;
        await dresstype.save();
        res.json(dresstype);
    } catch (error) {
        console.error(error);
        return res.status(500).send('Server error');
    }
});

module.exports = router;