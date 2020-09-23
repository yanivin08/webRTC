const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true
    },
    user: {
        type: String,
        required: true
    },
    active: {
        type: Boolean,
        default: false
    },
    status:{
        type: String,
        default: "Open"
    },
    dateStart: {
        type: Date,
        default: Date.now
    },
    dateFinish: {
        type: Date,
        default: 0
    }
})

const Session = mongoose.model('Session', UserSchema);

module.exports = Session;