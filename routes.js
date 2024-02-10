const express = require('express')
const router = express.Router()
const cookie = require('cookie')
const StatusCodes = require('./constants/StatusCodes')
const passport = require('passport')
const MultipleChoiceQuestion = require('./models/multipleChoiceQuestion')
const TrueFalseQuestion = require('./models/trueFalseQuestion')
const authUser = require('./config/auth')
const auth = require('./controllers/auth')
const page = require('./controllers/page')
const question = require('./controllers/question')


// auth user
router.post('/register', auth.register )
router.post('/login', auth.login)
// router.post('/verify', auth.verifyEmail)
// router.post('/reset-password', auth.resetPassword)
// router.post('/refresh-token', auth.refreshToken)

// rendering pages - ejs
router.get('/', page.homePage)
router.get('/add-question', page.addQuestion);
router.get('/register', page.registerUser)
router.get('/api-setting', page.settings)
router.get('/login', page.login)
router.get('/edit-question/:questionId/:questionType', page.editQuestion)
router.get('/browse', page.browse)

// question api
router.post('api/add-question', auth ,  question.create)
router.put('api/update-question/:questionId', auth, question.update )
router.delete('api/delete-question/:questionId', auth, question.delete)
router.delete('api/remove-question/:questionId', auth, question.remove )


router.get('/protected-route', (req, res, next) => {
    passport.authenticate('jwt', { session: false }, (err, user, info) => {
        // Custom callback function logic
        if (err) {
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        if (!user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        // Continue with the route logic if authentication is successful
        res.json({ message: 'You are authenticated!', user });
    })(req, res, next);
});




router.get('/questions', passport.authenticate('jwt', {session: false}) ,async (req, res)=>{
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
})



router.get('/profile', (req, res , next)=>{

    const cookies = req.headers.cookie || '';
    const tokenCookie = cookie.parse(cookies).token;

    if (!tokenCookie) {
        console.log('No token found. Redirecting to login.');
        return res.render('index', { isAuthenticated: false });
    }

    passport.authenticate('jwt', {session: false}, async (err, user , info) =>{
        if(err){
            return res.status(500).json({
                status: false, 
                message: 'Internal Server Error'
            })
        }
        
        if(!user){
            console.log('Info : ', info);
        }

        const userUnverifiedQuestions = await fetchQuestions(user, false)
        const userVerifiedQuestions = await fetchQuestions(user, true)

        console.log("userVerifiedQuestions : ", userVerifiedQuestions);
        console.log("userUnverifiedQuestions : ", userUnverifiedQuestions);
        const data = {
            "username": user.username, 
            "quizLimit": user.quizlimit,
            "totalQuiz": user.createdQuestions.length,
            "quizleft": (user.quizlimit - user.createdQuestions.length),
            "role": user.roles,
            "userUnverifiedQuestions": userUnverifiedQuestions,
            "userVerifiedQuestions": userVerifiedQuestions,
            "userUnverifiedTotal": userUnverifiedQuestions.length,
            "userVerifiedTotal": userVerifiedQuestions.length
        }

       res.render('profile', data)

    })(req, res, next)
})


async function fetchQuestions(user, isPublished) {
    const userID = user._id; 
    const questions = [];
    const data1 = await MultipleChoiceQuestion.find({ createdBy: userID, isPublic: isPublished });
    questions.push(...data1);
    const data2 = await TrueFalseQuestion.find({ createdBy: userID, isPublic: isPublished }); 
    questions.push(...data2);
    return questions;
}


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