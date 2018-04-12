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

const category = mongoose.model('Category', categorySchema);
module.exports = category;