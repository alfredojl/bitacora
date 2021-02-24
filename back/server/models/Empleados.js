const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let empleadoSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String
    },
    photo: {
        type: String
    },
    status: {
        type: Boolean,
        default: true
    }
})

module.exports = mongoose.model('Empleado', empleadoSchema);