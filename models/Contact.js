const mongoose = require('mongoose');

const ContactSchema = mongoose.Schema({
     user: {
         type: mongoose.Schema.Types.ObjectId,
         ref: 'users'
     },
    name: {
        type: String,
        require: true
    },

    number: {
        type: String,
        required: true,
    },
    gender: {
        type: String,
        default: 'male'
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('contact', ContactSchema);