const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let asistenciaSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    check: {
        type: Date
    }
})

module.exports = mongoose.model('Asistencia', asistenciaSchema);