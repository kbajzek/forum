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
    ratings: [{
        name: {type: String},
        users: [{
            type: Schema.Types.ObjectId,
            ref: 'User'
        }]
    }],
    parentThread: {
        type: Schema.Types.ObjectId,
        ref: 'Thread'
    }
});

postSchema.plugin(AutoIncrement, {id: 'post_seq', inc_field: 'postId'});

const post = mongoose.model('Post', postSchema);
module.exports = post;