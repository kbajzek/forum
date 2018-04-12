const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);
const {Schema} = mongoose;

const subCategorySchema = new Schema(
    {
        name: {type: String},
        description: {type: String},
        threads: [{
            type: Schema.Types.ObjectId,
            ref: 'Thread'
        }]
    }
); 

subCategorySchema.methods.getPostCount = function(callback) {
    this.populate('threads', function(err, subCategories) {
        const postcount = subCategories.threads.reduce((total, thread) => {
            return total + thread.posts.length;
        });
        if (err) {return callback(err)}
        callback(null, postcount);
    });
};

subCategorySchema.plugin(AutoIncrement, {id: 'subCategory_seq', inc_field: 'subCategoryId'});

const subcategory = mongoose.model('SubCategory', subCategorySchema);
module.exports = subcategory;