const mongoose = require('mongoose');
const Schema = mongoose.Schema;



// Patient schema
const patientSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
        required: true,
    },
    city: {
        type: String,
        required: true
    },
    addharNumber:{
        type: Number,
        required: true,
        
    },
    reports: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Report',
        }
    ]
}, {
    timestamps: true
});


module.exports = mongoose.model('Patient', patientSchema);
