
const mongoose = require('mongoose');

const appliedCouponSchema = new mongoose.Schema({
    couponCode: {
        type: String,
    },
    isUsed: {
        type: Boolean,
        default : false
    }
});

module.exports =  mongoose.model('appliedCoupon', appliedCouponSchema);