const express = require('express');
const router = express.Router();

const Coupon = require('../model/Coupon');

const verify = require('../middleware/verify');
const auth = require('../middleware/auth')
const check = require('../middleware/check')

router.post('/',auth ,verify.isAdmin, async (req, res) => {
    const { name, code, type, value, isActive } = req.body;
    try {
        const cod = await Coupon.findOne({ code: code });
        if (cod) {
            return res.status(422).json({ msg: 'Code is already in use.' });
        }
        const coupon = new Coupon({
            name,
             code,
            type,
             value,
             isActive})

        await coupon.save();
        res.json(coupon);
    } catch (error) {
        console.error(error);
        return res.status(500).send('Server error');
    }
});
router.get('/',auth ,verify.isAdmin, async (req, res) => {
    try {
        const coupon = await Coupon.find().sort({date:-1});
        res.json(coupon);
    } catch (error) {
        console.error(error);
        return res.status(500).send('Server error');
    }
});
router.get('/:code', auth, check.notAdmin ,async (req, res) => {
    try {
        const coupon = await Coupon.findOne({ code: req.params.cid });
        if (!coupon) {
            return res.status(401).json({ msg: 'Coupon Code does not exist' });
        }
        res.json(coupon);
    } catch (error) {
        console.error(error);
        return res.status(500).send('Server error');
    }
});
router.patch('/:cid', auth ,verify.isAdmin, async (req, res) => {
    try {
        const coupon = await Coupon.findByIdAndUpdate(req.params.cid, { $set: req.body }, { new: true });
        res.json(coupon);
    } catch (error) {
        console.error(error);
        return res.status(500).send('Server error');
    }
});

module.exports = router;