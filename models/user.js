const mongoose = require('mongoose'); // Erase if already required

var userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true,
        index:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    },
    quizlimit: {
        type: Number,
        require: true,
        default: 25
    },
    createdQuestions: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "MultipleChoiceQuestion"
        },
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "TrueFalseQuestion"
        }
    ]
});

//Export the model
module.exports = mongoose.model('User', userSchema);