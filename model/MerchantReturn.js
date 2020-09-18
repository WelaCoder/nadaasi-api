const mongoose = require('mongoose');

const MerchantReturnSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    orderId: {
        type: String,
    },
    email: {
        type: String,
    },
    problem: {
        type: String,
    },
    phone: {
        type: String,
    },
    isResolved: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('merchantreturn', MerchantReturnSchema);