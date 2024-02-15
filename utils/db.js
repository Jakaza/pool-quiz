const MultipleChoiceQuestion = require('./models/multipleChoiceQuestion')
const TrueFalseQuestion = require('./models/trueFalseQuestion')

async function fetchQuestions(user, isPublished) {
    const userID = user._id; 
    const questions = [];
    const data1 = await MultipleChoiceQuestion.find({ createdBy: userID, isPublic: isPublished });
    questions.push(...data1);
    const data2 = await TrueFalseQuestion.find({ createdBy: userID, isPublic: isPublished }); 
    questions.push(...data2);
    return questions;
}

async function getQuestions(req, res){
    const currentUser = req.user
    try {
        const multipleChoiceQuestions = await MultipleChoiceQuestion.find({createdBy: currentUser._id})
        const trueFalseQuestion = await TrueFalseQuestion.find({createdBy: currentUser._id})
        const questions = {
            'Type A' : multipleChoiceQuestions,
            'Type B' : trueFalseQuestion
        }
        res.status(StatusCodes.Success)
            .json({status: true , questions: questions
        })
    } catch (error) {
        console.log(err);
        res.status(StatusCodes.Internal)
            .json({status: false, message: 'Something went wrong try again...',
        error: err  })
    }
}

function isDifficultyChecked(req){
    return req.query.difficulty ? true : false
}


module.exports = {
    fetchQuestions,
    getQuestions,
    isDifficultyChecked
}