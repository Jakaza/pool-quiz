const cookie = require('cookie')

const isUserLoggedIn = (req, res, next) => {
    const cookies = req.headers.cookie || '';
    const tokenCookie = cookie.parse(cookies).token;
    if (!tokenCookie) {
        req.isAuthenticated = false
    }else{
        req.isAuthenticated = true
    }
    next()
}

module.exports = isUserLoggedIn