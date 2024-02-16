const mongoose = require('mongoose');

const multipleChoiceQuestionSchema = new mongoose.Schema({
    question: {
        type: String,
        required: true,
    },
    correctAnswer: {
        type: String,
        required: true,
    },
    incorrectOptions: {
        type: [String],
        required: true,
    },
    references: String,
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        index: true, 
    },
    difficulty: {
        type: String,
        required: true,
        enum: ['EASY', 'MEDIUM', 'HARD'],
        index: true, 
    },
    type: {
        type: String,
        required: true,
        default: 'multiple',
    },
    isPublic: {
        type: Boolean,
        required: true,
        default: false,
    },
    isPublished: {
        type: Boolean,
        required: true,
        default: false,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true,
    }
}, { timestamps: true }); 
module.exports = mongoose.model('MultipleChoiceQuestion', multipleChoiceQuestionSchema);
