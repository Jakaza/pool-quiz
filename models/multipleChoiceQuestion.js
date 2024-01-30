const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var multipleChoiceQuestionSchema = new mongoose.Schema({
    question:{
        type:String,
        required:true,
    },
    correctAnswer:{
        type:String,
        required:true,
    },
    incorrect1:{
        type:String,
        required:true,
    },
    incorrect2:{
        type:String,
        required:true,
    },
    incorrect3:{
        type:String,
        required:true,
    },
    references:{
        type:String,
        required:true,
    },
    difficulty: {
        type:String,
        required:true,
        enum: ['EASY', 'MEDIUM', 'HARD']
    },
    isPublic: {
        type:String,
        required:true,
        default: false
    },
    isPublished: {
        type:String,
        required:true,
        default: false
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});

//Export the model
module.exports = mongoose.model('MultipleChoiceQuestion', multipleChoiceQuestionSchema);