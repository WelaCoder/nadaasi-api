const express = require('express');
const router = express.Router();

const MerchantReturn = require('../model/MerchantReturn');

const verify = require('../middleware/verify');
const auth = require('../middleware/auth')
const check = require('../middleware/check')

router.post('/', auth, check.notAdmin, async (req, res) => {
    const { name, orderId, email, problem, phone } = req.body;
    try {
        const merchantreturn = new MerchantReturn({
            name,
            orderId,
            email,
            problem,
            phone
        })

        await merchantreturn.save();
        res.json(merchantreturn);
    } catch (error) {
        console.error(error);
        return res.status(500).send('Server error');
    }
});
router.get('/', auth, verify.isAdmin, async (req, res) => {
    try {
        const merchantReturn = await MerchantReturn.find().sort({ date: -1 });
        console.log(merchantReturn);
        res.json(merchantReturn);
    } catch (error) {
        console.error(error);
        return res.status(500).send('Server error');
    }
});
router.patch('/:rqid', auth, verify.isAdmin, async (req, res) => {
    try {
        console.log(req.body);
        const merchantReturn = await MerchantReturn.findByIdAndUpdate(req.params.rqid, { $set: req.body }, { new: req.body.isResolved });
        res.json(merchantReturn);
    } catch (error) {
        console.error(error);
        return res.status(500).send('Server error');
    }
});


router.get('/:rqid', auth, verify.isAdmin, async (req, res) => {
    try {
        console.log(req.body);
        const merchantReturn = await MerchantReturn.findById(req.params.rqid);
        res.json(merchantReturn);
    } catch (error) {
        console.error(error);
        return res.status(500).send('Server error');
    }
});

module.exports = router;