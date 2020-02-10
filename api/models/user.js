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
    password: { 
        type: String, 
        required: true
    },
    phonenumber: {
        type: String,
        unique: true,
        required: false
    },
    userImage: {
        type: String, 
        required: false
    }, 
    pause: {
        type: Boolean,
        default: false
    },

});


//exporting
module.exports = mongoose.model('User', userSchema);