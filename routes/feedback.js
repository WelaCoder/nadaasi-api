const express = require('express');
const router = express.Router();

const Feedback = require('../model/Feedback');
const Review = require('../model/Review');

const auth = require('../middleware/auth');
const verify = require('../middleware/verify');
const check = require('../middleware/check')

const mailer = require('../config/mailer');
const contactMail = require("../config/contactMail");
router.post('/', async (req, res) => {
    const { name, subject, email, message, phone } = req.body;
    try {
        const feedback = new Feedback({ name, subject, email, message, phone });
        console.log('sending mail');

        await feedback.save();
        await mailer.sendMail(
            {
                from: "info@nadaasi.com",
                to: "info@nadaasi.com",
                subject: "You have a new message",
                html: contactMail(feedback),
            },
        );
        console.log('contact us mail sent');
        res.json(feedback);
    } catch (error) {
        console.error(error);
        return res.status(500).send('Server error');
    }
});
router.get('/', auth, verify.isAdmin, async (req, res) => {
    try {
        const feedback = await Review.find().sort({ date: -1 });
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