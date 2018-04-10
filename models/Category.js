const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');
const {Schema} = mongoose;

const categorySchema = new Schema({
    name: {type: String},
    subCategories: [{
        type: Schema.Types.ObjectId,
        ref: 'SubCategory'
    }]
});

categorySchema.plugin(autoIncrement.plugin, {model: 'Category', field: 'categoryId'});
mongoose.model('Category', categorySchema);