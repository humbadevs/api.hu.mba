const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    email: { 
        type: String, 
        required: true, 
        unique: true, 
        match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
    },
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    birthdate: {
        type: Date,
        required: true
    },
    class: {
        type: String,

        //Change later for v1
        required: false,
        //
    },
    score: {
        type: String,

        //Change later for v1
        required: false,
        //
    },
    /*
    friends: {
        type: [friends],
        default: undefined,
    }, */
    currentBreak: {
        type: Boolean,
        default: false,
    },
    lastBreak: {
        type: String,
        default: null,
    },
    password: { 
        type: String, 
        required: true, 
    }
});

//exporting
module.exports = mongoose.model('User', userSchema);