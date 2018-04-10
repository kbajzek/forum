const mongoose = require('mongoose');
const {Schema} = mongoose;

var IncrementerSchema = Schema({
    _id: {type: String, required: true},
    seq: { type: Number, default: 0 }
});

const incrementer = mongoose.model('Incrementer', IncrementerSchema);
module.exports = incrementer;