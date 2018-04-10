const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');
const {Schema} = mongoose;

const userSchema = new Schema({
    name: {type: String}
});

userSchema.plugin(autoIncrement.plugin, {model: 'User', field: 'userId'});
mongoose.model('User', userSchema);