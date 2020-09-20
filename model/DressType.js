const mongoose = require('mongoose');

const dressTypeSchema = mongoose.Schema({

    label: {
        type: String,
    },
    value: {
        type: String
    },
    sale: {
        type: Boolean,
        default: false,
    },
    discount: {
        type: Number,
    },
    discountType: {
        type: String,
    },

    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('dressTypes', dressTypeSchema);
