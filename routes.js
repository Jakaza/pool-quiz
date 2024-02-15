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
router.get('/generate-url', Question.generateURL)
router.get('/questions', Question.getAllQuestions)

module.exports = router