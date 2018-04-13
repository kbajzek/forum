const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);
const {Schema} = mongoose;

const postSchema = new Schema({
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    createdOn: {type: Date},
    content: {type: String},
    parentThread: {
        type: Schema.Types.ObjectId,
        ref: 'Thread'
    }
});

postSchema.plugin(AutoIncrement, {id: 'post_seq', inc_field: 'postId'});

const post = mongoose.model('Post', postSchema);
module.exports = post;