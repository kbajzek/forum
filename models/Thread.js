const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);
const {Schema} = mongoose;

const threadSchema = new Schema({
    name: {type: String},
    totalViews: {type: Number, default: 0},
    posts: [{
        type: Schema.Types.ObjectId,
        ref: 'Post'
    }],
    parentSubCategory: {
        type: Schema.Types.ObjectId,
        ref: 'SubCategory'
    },
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    createdOn: {
        type: Date
    },
    lastPost: {
        type: Schema.Types.ObjectId,
        ref: 'Post'
    }
});

threadSchema.plugin(AutoIncrement, {id: 'thread_seq', inc_field: 'threadId'});

const thread = mongoose.model('Thread', threadSchema);
module.exports = thread;