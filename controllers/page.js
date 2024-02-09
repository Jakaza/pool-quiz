




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
    }
}