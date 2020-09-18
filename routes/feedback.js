const express = require('express');
const router = express.Router();

const Feedback = require('../model/Feedback');

const auth = require('../middleware/auth');
const verify = require('../middleware/verify');
const check = require('../middleware/check')


router.post('/', auth, check.notAdmin, async (req, res) => {
    const { name, subject, email, message, phone } = req.body;
    try {
        const feedback = new Feedback({ name, subject, email, message, phone });
        await feedback.save();
        res.json(feedback);
    } catch (error) {
        console.error(error);
        return res.status(500).send('Server error');
    }
});
router.get('/', auth, verify.isAdmin, async (req, res) => {
    try {
        const feedback = await Feedback.find().sort({ date: -1 });
        res.json(feedback);
    } catch (error) {
        console.error(error);
        return res.status(500).send('Server error');
    }
});
// route.put('/:fid', auth ,verify.isAdmin, (req, res) => {
//     try {
//         const feedback = await Feedback.findByIdAndUpdate(fid, { isResolved: req.body }, { new: true });
//         res.json(feedback);
//     } catch (error) {
//         console.error(error);
//         return res.status(500).send('Server error');
//     }
// });
router.patch('/:fid', auth, verify.isAdmin, async (req, res) => {
    try {
        const feedback = await Feedback.findByIdAndUpdate(req.params.fid, { $set: req.body }, { new: true });
        res.json(feedback);
    } catch (error) {
        console.error(error);
        return res.status(500).send('Server error');
    }
})
module.exports = router;