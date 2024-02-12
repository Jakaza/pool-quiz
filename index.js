require('dotenv').config()
const express = require('express')
const path = require('path')
const http = require('http')
const bodyParser = require('body-parser')
const app = express()
const routes = require('./routes')
const initDB = require('./config/connectDB')
const seedDB = require('./config/seed')
const passport = require('passport')
initDB().then(() => {
    // seedDB()
});
//Middlewares Config
const cookieParser = require('cookie-parser');
app.use(cookieParser());
app.use(express.json())
app.use(bodyParser.urlencoded({extended: false}))
app.set('view engine', 'ejs')
app.use(express.static(path.join(__dirname, 'public')))
require('./config/passport')
app.use(passport.initialize());
app.use(routes)
const server = http.createServer(app)
const PORT = process.env.PORT || 3000
server.listen(PORT, ()=>{
    console.log(`Server is up at port ${PORT}`);
})
