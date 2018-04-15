const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);
const {Schema} = mongoose;

const subCategorySchema = new Schema(
    {
        name: {type: String},
        description: {type: String},
        subCategories: [{
            type: Schema.Types.ObjectId,
            ref: 'SubCategory'
        }],
        ancestors: [{
            type: Schema.Types.ObjectId,
            ref: 'SubCategory'
        }],
        threads: [{
            type: Schema.Types.ObjectId,
            ref: 'Thread'
        }],
        postCount: {type: Number, default: 0},
        lastPost: {
            type: Schema.Types.ObjectId,
            ref: 'Post'
        }
    }
);

subCategorySchema.methods.addSubCategory = function(childSubCategory) {
    let subcategory = this;
    return new Promise(function(resolve, reject) {
        subcategory.subCategories.push(childSubCategory);
        subcategory.save()
            .then(subcat => resolve(subcat))
            .catch(err => reject(err));
    })
  };

subCategorySchema.plugin(AutoIncrement, {id: 'subCategory_seq', inc_field: 'subCategoryId'});

const subcategory = mongoose.model('SubCategory', subCategorySchema);
module.exports = subcategory;