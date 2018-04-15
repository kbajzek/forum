const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);
const {Schema} = mongoose;

const categorySchema = new Schema({
    name: {type: String},
    subCategories: [{
        type: Schema.Types.ObjectId,
        ref: 'SubCategory'
    }]
});

categorySchema.plugin(AutoIncrement, {id: 'category_seq', inc_field: 'categoryId'});

categorySchema.methods.addSubCategory = function(subCategory) {
    let category = this;
    return new Promise(function(resolve, reject) {
        category.subCategories.push(subCategory);
        category.save()
            .then(cat => resolve(cat))
            .catch(err => reject(err));
    })
  };

const category = mongoose.model('Category', categorySchema);
module.exports = category;