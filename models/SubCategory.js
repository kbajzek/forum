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
        threads: [{
            type: Schema.Types.ObjectId,
            ref: 'Thread'
        }]
    }
);

subCategorySchema.plugin(AutoIncrement, {id: 'subCategory_seq', inc_field: 'subCategoryId'});

const subcategory = mongoose.model('SubCategory', subCategorySchema);
module.exports = subcategory;