const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var trueFalseQuestionSchema = new mongoose.Schema({
    question:{
        type:String,
        required:true,
    },
    answer:{
        type:Boolean,
        required:true,
    },
    incorrect:{
        type: Boolean,
        required:true,
    },
    references:{
        type:String,
    },
    difficulty: {
        type:String,
        required:true,
        enum: ['EASY', 'MEDIUM', 'HARD'],
        default: 'EASY'
    },
    type: {
        type:String,
        required:true,
        default: 'truefalse'
    },
    isPublic: {
        type:Boolean,
        required:true,
        default: false
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

//Export the model
module.exports = mongoose.model('TrueFalseQuestion', trueFalseQuestionSchema);