const bcrypt = require('bcrypt')

const User = require('./models/user')
const StatusCodes = require('./constants/StatusCodes')

const auth = {
    register : async (req ,res) =>{
        const {username , email , password } = req.body
        if(!username || !email || !password){
            return res.status(StatusCodes.Bad_Request)
                        .json({status: false, message: 'Fill in all the field'})
        }
        try {
            const userExist = await User.findOne({username})
            if(userExist){
                return res.status(StatusCodes.Bad_Request)
                            .json({status: false, message: 'Username is already taken'})
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
    },
    login: async(req, res) =>{
        const {username , password } = req.body
        try {
            const userExist = await User.findOne({username})
            if(!userExist){
                return res.status(StatusCodes.Bad_Request)
                        .json({status: false, message: 'Incorrect username or password... enter correct crendential'})
            }
            const isMatched = await bcrypt.compare(password, userExist.password)
            console.log(isMatched);
            if(!isMatched){
                return res.status(StatusCodes.Bad_Request)
                        .json({status: false, message: 'Incorrect username or password... enter correct crendential'})
            }
            const payload ={
                id: userExist._id,
                username: userExist.username
            }
            const secretOrPrivateKey = "Jakaza"
    
            const token =  jwt.sign(payload, secretOrPrivateKey, {expiresIn: '1d'} )
           
            res.setHeader('Set-Cookie', cookie.serialize('token', token, {
                httpOnly: true, 
                maxAge: 86400, // Expires in 1 day (1d * 24h * 60m * 60s)
                path: '/', 
                secure: process.env.NODE_ENV === 'production', 
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
    }
}


module.exports = auth