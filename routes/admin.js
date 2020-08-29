// const express = require('express');
// const jwt = require('jsonwebtoken');

// const { check, validationResult } = require('express-validator');

// const route = require('./user');

// const router = express.Router();

// router.post('/',
//     check('email', 'Email is required').isEmail(),
//     check('password', 'Password is required').isLength({ min: 6 }), (req, res)=> {
//     const error = validationResult(req);
//         if (!error.isEmpty()) {
//             return res.status(400).json({
//                 error: error.array()
//             });
//         };
//     const { email, password } = req.body
//     if (email === 'admin@example.com' && password === '12345678') {
//             payload = {
//                 user: {
//                     id: user.id,
//                 }
//             };
//         jwt.sign(payload, config.get('jwtsecret'), {
//             expiresIn: 36000
//         }, (error, token) => {
//             if (error) throw error;
//             res.json({
//                 token
//             });
//         });
//     };
// })
