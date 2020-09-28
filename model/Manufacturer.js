const mongoose = require('mongoose');

const manufacturerSchema = mongoose.Schema({

    name: {
        type: String,

    },
    email: {
        type: String,

    },

    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('manufacturers', manufacturerSchema);
