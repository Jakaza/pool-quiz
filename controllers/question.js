const MultipleChoiceQuestion = require('../models/multipleChoiceQuestion')
const TrueFalseQuestion = require('../models/trueFalseQuestion')

const Question = {
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
    },

    update: async (req, res)=>{
    // req.body.createdBy = req.user._id
    const { questionType, ...cleanedQuestion } = req.body;
    const currentUser = req.user
    const {questionId} = req.params
    try {
        if(questionType == "A"){
            const question = await MultipleChoiceQuestion.findOne({_id: questionId})

            const currentUserId = currentUser._id.toString()
            const quizUserId = question.createdBy.toString()
            
            if(currentUserId !== quizUserId){
                return res.status(StatusCodes.Not_Found)
                .json({status: false, message: 'Not authorized to update this quiz'})
            }
            if(!question){
                return res.status(StatusCodes.Not_Found).json({status: false, message: 'Question was not found'})
            }
            question.question = req.body?.question ?? question.question
            question.correctAnswer = req.body?.correctAnswer ?? question.correctAnswer
            question.incorrect1 = req.body?.incorrect1 ?? question.incorrect1
            question.incorrect2 = req.body?.incorrect2 ?? question.incorrect2
            question.incorrect3 = req.body?.incorrect3 ?? question.incorrect3
            question.references = req.body?.references ?? question.references

            await question.save()

            res.status(StatusCodes.Created).json({
                status: true, 
                message: 'Type A Quiz Has Been Successfully Updated.',
                question: question
            })
        }else if(questionType == "B"){
            const question = await TrueFalseQuestion.findOne({_id: questionId})

            const currentUserId = currentUser._id.toString()
            const quizUserId = question.createdBy.toString()
            
            if(currentUserId !== quizUserId){
                return res.status(StatusCodes.Not_Found)
                .json({status: false, message: 'Not authorized to update this quiz'})
            }

            question.question = req.body?.question ?? question.question
            question.answer = req.body?.answer ?? question.answer
            question.incorrect = req.body?.incorrect ?? question.incorrect
            question.references = req.body?.references ?? question.references

            if(!question){
                return res.status(StatusCodes.Not_Found).json({status: false, message: 'Question was not found'})
            }

            await question.save()

            res.status(StatusCodes.Created).json({
                status: true, 
                message: 'Type B Quiz Has Been Successfully Updated.',
                question: newQuestion
            })
        }else{
            return res.status(StatusCodes.Bad_Request).json({status: false, message: 'Invalid Question Type'})
        }
        } catch (error) {
            console.log(error);
            res.status(StatusCodes.Internal).json({
                status: false,
                message: 'Something went wrong try again...',
                error  
            })
        }
    },
    // When a user removes a question, only the createdBy ID is removed.
    // The SuperAdmin will determine whether to permanently delete the question or not.
    // Ownership is revoked, but the question itself is retained in the database.
    delete: async (req, res)=>{
        const {questionId} = req.params
        const currentUser = req.user
        console.log(currentUser);
        try {
            const question = await MultipleChoiceQuestion.findOne({_id: questionId})
            if(!question){
                return res.status(StatusCodes.Not_Found)
                        .json({status: false, message: 'Question was not found',})
            }
            const currentUserId = currentUser._id.toString()
            const quizUserId = question.createdBy.toString()
            if(currentUserId !== quizUserId){
                return res.status(StatusCodes.Bad_Request)
                .json({status: false, message: 'Not authorized to update this quiz'})
            }
            question.createdBy = null
            await question.save()
            res.status(StatusCodes.Success)
            .json({status: true, message: 'Question has been successfully removed'})
    
        } catch (err) {
            console.log(err);
            res.status(StatusCodes.Internal)
            .json({status: false, message: 'Something went wrong try again...',
            error: err  })
        }
    },

    // The SuperAdmin has the authority to delete questions 
    // either without ownership or questions they own.
    remove: async(req, res)=>{
        const {questionId} = req.params
        const currentUser = req.user
        try {
            if(!question){
                return res.status(StatusCodes.Not_Found)
                        .json({status: false, message: 'Question was not found',})
            }
            if(currentUser.roles === "SUPER ADMIN"){
                // await MultipleChoiceQuestion.findOne({_id: questionId});
                // if (!question) {
                //     question = await TrueFalseQuestion.findOne({_id: questionId});
                // }
            }
            res.status(StatusCodes.Success)
            .json({status: true, message: 'Question has been successfully removed'})
    
        } catch (err) {
            console.log(err);
            res.status(StatusCodes.Internal)
            .json({status: false, message: 'Something went wrong try again...',
            error: err  })
        }
    }
}

module.exports = Question