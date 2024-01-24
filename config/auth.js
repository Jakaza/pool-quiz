const passport = require("passport")

const authUser = () => {
    return passport.authenticate('jwt', {session: false})
}
module.exports = authUser

