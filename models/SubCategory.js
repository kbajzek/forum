const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');
const {Schema} = mongoose;

const subCategorySchema = new Schema({
    name: {type: String},
    description: {type: String},
    threads: [{
        type: Schema.Types.ObjectId,
        ref: 'Thread'
    }]
});

subCategorySchema.plugin(autoIncrement.plugin, {model: 'SubCategory', field: 'subCategoryId'});
mongoose.model('SubCategory', subCategorySchema);