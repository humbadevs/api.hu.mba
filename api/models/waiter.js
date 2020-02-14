const mongoose = require('mongoose');

const waiterSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    hum_id: {
        type: String,
        required: true,
        unique: true,
    },
    timestamp: {
      type: String,
      default: new Date().toISOString()
    }

});

//exporting
module.exports = mongoose.model('Waiter', waiterSchema);
