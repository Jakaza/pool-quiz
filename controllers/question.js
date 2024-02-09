

const MultipleChoiceQuestion = require('./models/multipleChoiceQuestion')
const TrueFalseQuestion = require('./models/trueFalseQuestion')


const question = {
    create: async (req, res)=>{ 
        req.body.createdBy = req.user._id
        console.log(req.body);
        const { questionType, ...cleanedQuestion } = req.body;
        try {
            if(questionType == "A"){
                const newQuestion = new MultipleChoiceQuestion(cleanedQuestion)
                await newQuestion.save()
                const currentUser = req.user
                currentUser.createdQuestions.push(newQuestion._id)
                await currentUser.save()
                res.status(StatusCodes.Created).json({
                    status: true, 
                    message: 'Quiz has been successfully added. Type A',
                    question: newQuestion
                })
            }else{
                const newQuestion = new TrueFalseQuestion(cleanedQuestion)
                await newQuestion.save()
                const currentUser = req.user
                currentUser.createdQuestions.push(newQuestion._id)
                await currentUser.save()
                res.status(StatusCodes.Created).json({
                    status: true, 
                    message: 'Quiz has been successfully added.',
                    question: newQuestion
                })
            }
        } catch (error) {
            console.log(error);
            res.status(StatusCodes.Internal).json({
                status: false,
                message: 'Something went wrong try again...',
                error  
            })
        }
    }
}

module.exports = question