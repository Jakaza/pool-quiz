const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String
    },    
    tags: {
        type: [String]
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    lastModifiedAt: {
        type: Date,
        default: Date.now
    },
     isVisible: {
        type: Boolean,
        default: true
    },
    image: {
        type: String // Assuming a URL to the image
    }
})

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
