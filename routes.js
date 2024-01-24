const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const StatusCodes = require('./constants/StatusCodes')
const User = require('./models/user')
const passport = require('passport')

// Auth Routes 
router.post('/register',async (req ,res) =>{
    const {username , email , password } = req.body
    if(!username || !email || !password){
        res.status(StatusCodes.Bad_Request).json({status: false, message: 'Fill in all the field'})
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
        const secretOrPrivateKey = process.env.JWT_SECRET

        const token =  jwt.sign(payload, secretOrPrivateKey, {expiresIn: '1d'} )

        res.status(StatusCodes.Success).json({
            status: true, 
            message: 'User has been successfully logged in.',
            token: `Bearer ${token}`
        })
    } catch (error) {
        res.status(StatusCodes.Internal).json({
            status: false,
            message: 'Something went wrong try again...',
            error  
        })
    }
})

router.get('/testing2', passport.authenticate('jwt', {session: false}), (req, res) =>{
    res.json({
        status: true,
        user: req.user
    })
    // res.status(200).json({status: true,message: 'Testing routes from routes dir'})
})


// Render Pages - EJS

router.get('/register', (req, res) =>{

    res.render('register')
})
router.get('/login', (req, res) =>{
    res.render('login')
})
router.get('/add-question', passport.authenticate('jwt', { session: false }), (req, res) => {
    
    console.log('Auth : ' + req.isAuthenticated());
    if (!req.isAuthenticated()) {
        // User is not authenticated, redirect to the login page
        return res.redirect('/login');
    }
    // User is authenticated, render the 'create_question' page
    res.render('create_question', { user: req.user });
});


router.get('/browse', (req, res) =>{
    res.render('browse')
})


module.exports = router