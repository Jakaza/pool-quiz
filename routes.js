const express = require('express')
const router = express.Router()
const cookie = require('cookie')
const StatusCodes = require('./constants/StatusCodes')
const passport = require('passport')
const MultipleChoiceQuestion = require('./models/multipleChoiceQuestion')
const TrueFalseQuestion = require('./models/trueFalseQuestion')
const authUser = require('./config/auth')
const Auth = require('./controllers/auth')
const Page = require('./controllers/page')
const Question = require('./controllers/question')
const isUserLoggedIn = require('./utils/checkLogin')

// auth user
router.post('/register', Auth.register )
router.post('/login', Auth.login)
// router.post('/verify', Auth.verifyEmail)
// router.post('/reset-password', Auth.resetPassword)
// router.post('/refresh-token', Auth.refreshToken)

// rendering pages - ejs
router.get('/',isUserLoggedIn, Page.homePage)
router.get('/add-question', isUserLoggedIn, Page.addQuestion);
router.get('/register', Page.registerUser)
router.get('/api-setting', isUserLoggedIn, Page.settings)
router.get('/login', Page.login)
router.get('/edit-question/:questionId/:questionType', Page.editQuestion)
router.get('/browse', Page.browse)
router.get('/profile', Page.profile)
router.get('/policy', Page.policy)
router.get('/terms', Page.terms)

// question api
router.post('api/add-question', authUser ,  Question.create)
router.put('api/update-question/:questionId', authUser, Question.update )
router.delete('api/delete-question/:questionId', authUser, Question.delete)
router.delete('api/remove-question/:questionId', authUser, Question.remove )




// https://opentdb.com/api.php?amount=10&category=23&difficulty=hard&type=multiple

router.get('/generate-url', async (req, res )=>{
    let url = 'http://localhost:3000/api/v1/question'
    const queryParams = [];
    if (req.body.amount) queryParams.push('amount=' + encodeURIComponent(req.body.amount));
    if (req.body.category) queryParams.push('category=' + encodeURIComponent(req.body.category));
    if (req.body.difficulty) queryParams.push('difficulty=' + encodeURIComponent(req.body.difficulty));
    if (req.body.type) queryParams.push('type=' + encodeURIComponent(req.body.type));
    if (queryParams.length > 0) {
        url += '?' + queryParams.join('&');
    }
    res.status(StatusCodes.Created).json({
        status: true, 
        message: 'Url has been successfully created.',
        url: url,
    })
})

router.get('/questions', async (req, res )=>{
        const query = {};
        // if (req.query.category) query.category = req.query.category;
        if (req.query.difficulty) query.difficulty = req.query.difficulty;

        const amount = req.query.amount? req.query.amount : 10
        let limitAmount = parseInt(amount, 10);
        const response = {
            status: true,
            data : [
            ]
        }
        try{
            if(isDifficultyChecked(req)){
                if(req.query.type == "multiple"){
                    const data = await MultipleChoiceQuestion.aggregate([
                        { $sample: { size: limitAmount } }
                      ])
                    response.data.push(data)
                }else{
                    const data = await TrueFalseQuestion.aggregate([
                        { $sample: { size: limitAmount } }
                      ])
                    response.data.push(data)
                }
            }else{
                limitAmount = Math.floor(limitAmount/2)
                const data = await MultipleChoiceQuestion.aggregate([
                    { $sample: { size: limitAmount } }
                  ])
                const data2 = await TrueFalseQuestion.aggregate([
                    { $sample: { size: limitAmount } }
                  ])
                response.data.push(data)
                response.data.push(data2)
            }
            res.json(response)
        }catch(er){
            console.log(er);
        }
})
function isDifficultyChecked(req){
    return req.query.difficulty ? true : false
}

module.exports = router