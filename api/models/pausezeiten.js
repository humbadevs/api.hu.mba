const mongoose = require('mongoose');

const pausezeitenSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    pausen:{
    ersteStunde : {
        type: Boolean,
        default: false,
    },
    zweiteStunde : {
        type: Boolean,
        default: false,
    },
    dritteStunde : {
        type: Boolean,
        default: false,
    },
    vierteStunde : {
        type: Boolean,
        default: false,
    },
    fünfteStunde : {
        type: Boolean,
        default: false,
    },
    sechsteStunde : {
        type: Boolean,
        default: false,
    }

    


}})
