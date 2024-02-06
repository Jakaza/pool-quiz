const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const StatusCodes = require('./constants/StatusCodes')
const User = require('./models/user')
const passport = require('passport')
const MultipleChoiceQuestion = require('./models/multipleChoiceQuestion')
const TrueFalseQuestion = require('./models/trueFalseQuestion')
const authUser = require('./config/auth')
const cookie = require('cookie')



// Auth Routes 
router.post('/register',async (req ,res) =>{
    console.log(req.body);
    const {username , email , password } = req.body
    if(!username || !email || !password){
        return res.status(StatusCodes.Bad_Request).json({status: false, message: 'Fill in all the field'})
    }
    try {
        const userExist = await User.findOne({username})
        if(userExist){
            return res.status(StatusCodes.Bad_Request).json({status: false, message: 'Username is already taken'})
        }
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(password, salt);

        const newUser = new User({username,email,password: hash})
        await newUser.save()

        res.status(StatusCodes.Created).json({
            status: true, 
            message: 'User has been successfully created.',
            user: {
                id: newUser._id,
                username,
                email
            }
        })
    } catch (error) {
        res.status(StatusCodes.Internal).json({
            status: false,
            message: 'Something went wrong try again...',
            error  
        })
    }
})

router.post('/login', async (req ,res) =>{
    const {username , password } = req.body
    try {
        const userExist = await User.findOne({username})

        if(!userExist){
            return res.status(StatusCodes.Bad_Request).json({status: false, message: 'Incorrect username or password... enter correct crendential'})
        }
        const isMatched = await bcrypt.compare(password, userExist.password)
        console.log(isMatched);
        if(!isMatched){
            return res.status(StatusCodes.Bad_Request).json({status: false, message: 'Incorrect username or password... enter correct crendential'})
        }

        const payload ={
            id: userExist._id,
            username: userExist.username
        }
        const secretOrPrivateKey = "Jakaza"

        const token =  jwt.sign(payload, secretOrPrivateKey, {expiresIn: '1d'} )

        // Set the token as a cookie
        res.setHeader('Set-Cookie', cookie.serialize('token', token, {
            httpOnly: true, 
            maxAge: 86400, // Expires in 1 day (1d * 24h * 60m * 60s)
            path: '/', // The path for which the cookie is valid
            secure: process.env.NODE_ENV === 'production', // Set to true if using HTTPS in production
            sameSite: 'strict', 
        }));

        res.status(StatusCodes.Success).json({
            status: true,
            message: 'User has been successfully logged in.',
            });
    } catch (error) {
        res.status(StatusCodes.Internal).json({
            status: false,
            message: 'Something went wrong try again...',
            error  
        })
    }
})



// Render Pages - EJS

router.get('/', (req, res, next) =>{
    const cookies = req.headers.cookie || '';
    const tokenCookie = cookie.parse(cookies).token;

    if (!tokenCookie) {
        console.log('No token found. Redirecting to login.');
        return res.render('index', { isAuthenticated: false });
    }

    passport.authenticate('jwt', { session: false }, (err, user, info) => {
        if (err) {
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        if (!user) {
            return res.render('index',{ isAuthenticated: false })
        }
        console.log(user);
        return res.render('index', { isAuthenticated: true, user: user })
    })(req, res, next)
})

router.get('/add-quiz', (req, res) =>{
    res.render('add_quiz_sample')
})

router.get('/register', (req, res) =>{
    res.render('register')
})

router.get('/api-setting', (req, res) =>{
    res.render('api_setting')
})

router.get('/login', (req, res) =>{
    res.render('login')
})



router.get('/add-question', (req, res, next) =>{
    passport.authenticate('jwt', { session: false }, (err, user, info) => {
        if (err) {
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        if (!user) {
            console.log('You cannot access add-question you not authorized');
            return res.status(401).redirect('login')
        }
        return res.render('create_question')
    })(req, res, next)
});

router.get('/browse', (req, res, next)=>{
    const cookies = req.headers.cookie || '';
    const tokenCookie = cookie.parse(cookies).token;

    if (!tokenCookie) {
        console.log('No token found. Redirecting to login.');
        return res.status(401).redirect('/login');
    }

    passport.authenticate('jwt', { session: false }, (err, user, info) => {
        if (err) {
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        if (!user) {
            return res.status(401).redirect('login')
        }
        console.log(user);
        return res.render('browse', { isAuthenticated: true, user: user })
    })(req, res, next)
})

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



// QUESTION ROUTE

router.post('/add-question', passport.authenticate('jwt', {session: false}) , async (req, res)=>{
    req.body.createdBy = req.user._id
    console.log(req.body);
    const { questionType, ...cleanedQuestion } = req.body;
    try {
        if(questionType == "A"){
            const newQuestion = new MultipleChoiceQuestion(cleanedQuestion)
            await newQuestion.save()
            const currentUsser = req.user
            currentUsser.createdQuestions.push(newQuestion._id)
            await currentUsser.save()
            res.status(StatusCodes.Created).json({
                status: true, 
                message: 'Quiz has been successfully added. Type A',
                question: newQuestion
            })
        }else{
            const newQuestion = new TrueFalseQuestion(cleanedQuestion)
            await newQuestion.save()
            const currentUsser = req.user
            currentUsser.createdQuestions.push(newQuestion._id)
            await currentUsser.save()
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
})

router.put('/update-question/:questionId',  passport.authenticate('jwt', {session: false}), async (req, res)=>{
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
})

// When a user removes a question, only the createdBy ID is removed.
// The SuperAdmin will determine whether to permanently delete the question or not.
// Ownership is revoked, but the question itself is retained in the database.
router.delete('/remove-question/:questionId',passport.authenticate('jwt', {session: false}), async (req, res)=>{
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
})
// The SuperAdmin has the authority to delete questions 
// either without ownership or questions they own.
router.delete('/delete-question', passport.authenticate('jwt', {session: false}), async()=>{
    const {questionId} = req.params
    const currentUser = req.user
    console.log(currentUser);
    try {
        const question = await MultipleChoiceQuestion.findOne({_id: questionId})
        if(!question){
            return res.status(StatusCodes.Not_Found)
                    .json({status: false, message: 'Question was not found',})
        }
        TODO: // Super-admin must delete question from DB
        res.status(StatusCodes.Success)
        .json({status: true, message: 'Question has been successfully removed'})

    } catch (err) {
        console.log(err);
        res.status(StatusCodes.Internal)
        .json({status: false, message: 'Something went wrong try again...',
        error: err  })
    }
})
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

    passport.authenticate('jwt', {session: false}, (err, user , info) =>{
        if(err){
            return res.status(500).json({
                status: false, 
                message: 'Internal Server Error'
            })
        }
        
        if(!user){
            console.log('Info : ', info);
        }
        const data = {
            "username": user.username, 
            "quizLimit": user.quizlimit,
            "totalQuiz": user.createdQuestions.length,
            "quizleft": (user.quizlimit - user.createdQuestions.length),
            "role": user.roles
        }

       res.render('profile', data)

    })(req, res, next)
})


module.exports = router