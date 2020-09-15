const express = require('express');
const config = require('config');
const jwt = require('jsonwebtoken');

const { check, validationResult } = require('express-validator');

const User = require('../model/User')

const verify = require('../middleware/verify')
const auth = require('../middleware/auth');


const router = express.Router();
// Route admin route
router.post('/login',
    check('email', 'Email is required').isEmail(),
    check('password', 'Password is required').isLength({ min: 6 }), async (req, res) => {
        const error = validationResult(req);
        if (!error.isEmpty()) {
            return res.status(400).json({
                error: error.array()
            });
        };
        const { email, password } = req.body
        try {
            user = await User.findOne({ email });
            if (!user) {
                return res.status(400).json({ msg: 'Invalid Credentials' });
            }
            if (password !== user.password) {
                return res.status(400).json({ msg: 'Invalid Credentials' });
            }
            payload = {
                user: {
                    id: user.id,
                    admin: user.admin
                }
            };
            jwt.sign(payload, config.get('jwtsecret'), {
                expiresIn: '364d'
            }, (error, token) => {
                if (error) throw error;
                res.json({
                    token
                });
            });
        } catch (error) {
            console.error(error);
            return res.status(500).send('Server error');
        }
    })
router.get('/', auth, verify.isAdmin, async (req, res) => {
    try {

        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: 'Server Error' });
    }
});

module.exports = router