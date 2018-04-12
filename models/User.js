const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);
const {Schema} = mongoose;

const userSchema = new Schema({
    name: {type: String}
});

userSchema.plugin(AutoIncrement, {id: 'user_seq', inc_field: 'userId'});

const user = mongoose.model('User', userSchema);
module.exports = user;