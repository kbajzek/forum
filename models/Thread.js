const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');
const {Schema} = mongoose;

const threadSchema = new Schema({
    name: {type: String},
    totalViews: {type: Number},
    posts: [{
        type: Schema.Types.ObjectId,
        ref: 'Post'
    }]
});

threadSchema.plugin(autoIncrement.plugin, {model: 'Thread', field: 'threadId'});
mongoose.model('Thread', threadSchema);