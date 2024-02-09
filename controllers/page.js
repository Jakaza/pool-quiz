const passport = require('passport')
const cookie = require('cookie')

const page = {
    homePage: (req, res, next) =>{ 
        const cookies = req.headers.cookie || '';
        const tokenCookie = cookie.parse(cookies).token;
        if (!tokenCookie) {
            return res.render('index', { isAuthenticated: false });
        }
        passport.authenticate('jwt', { session: false }, (err, user, info) => {
            if (err) {
                return res.status(500).render('server_error');
            }
            if (!user) {
                return res.render('index',{ isAuthenticated: false })
            }
            console.log(user);
            return res.render('index', { isAuthenticated: true, user: user })
        })(req, res, next)
    },

    addQuestion : (req, res, next) =>{
        passport.authenticate('jwt', { session: false }, (err, user, info) => {
            if (err) {
                return res.status(500).render('server_error');
            }
            if (!user) {
                console.log('You cannot access add-question you not authorized');
                return res.status(401).redirect('login')
            }
            return res.render('create_question')
        })(req, res, next)
    },
    editQuestion: (req, res, next) =>{

        passport.authenticate('jwt', {session: false}, async (err, user, info)=>{
            if(err){
                res.render('not_authorized') 
            }
            if(!user){
                res.render('not_authorized') 
            }
            const {questionId , questionType} = req.params
            const question = ''
            if(questionType === 'multiple'){
                question = await MultipleChoiceQuestion.findOne({_id: questionId})
            }else{
                question = await TrueFalseQuestion.findOne({_id: questionId})
            }
            question ? res.render('edit_question', {}) : res.redirect('/profile')
            
        })(req, res, next)
    },
    browse:  (req, res, next)=>{
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
    },
    registerUser: (req, res) =>{
        res.render('register')
    },
    settings: (req, res) =>{
        res.render('api_setting')
    },
    login: (req, res) =>{
        res.render('login')
    }
}

module.exports = page