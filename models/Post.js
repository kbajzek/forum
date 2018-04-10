const mongoose = require('mongoose');
const Incrementer = require('./Incrementer');
const {Schema} = mongoose;

const postSchema = new Schema({
    postId: {type: Number, default: 1},
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'Post'
    },
    createdOn: {type: Date},
    content: {type: String}
});

postSchema.pre('save', function(next) {
    let post = this;
    Incrementer.findByIdAndUpdate({_id: 'postId'}, {$inc: { seq: 1} }, function(error, incrementer)   {
        if(error) {
            return next(error);
        }
        post.postId = incrementer.seq;
        next();
    });
});

mongoose.model('Post', postSchema);