const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookie = require("cookie");
const User = require("../models/user");
const { STATUS_CODE, ROLES } = require("../constants/");

const Auth = {
  register: async (req, res) => {
    console.log(req.body);
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res
        .status(STATUS_CODE.Bad_Request)
        .json({ status: false, message: "Fill in all the field" });
    }
    try {
      const userExist = await User.findOne({ username });
      if (userExist) {
        return res
          .status(STATUS_CODE.Bad_Request)
          .json({ status: false, message: "Username is already taken" });
      }
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(password, salt);

      const newUser = new User({ username, email, password: hash });
      await newUser.save();
      res.status(STATUS_CODE.Created).json({
        status: true,
        message: "User has been successfully created.",
        user: {
          id: newUser._id,
          username,
          email,
        },
      });
    } catch (error) {
      res.status(STATUS_CODE.Internal).json({
        status: false,
        message: "Something went wrong try again...",
        error,
      });
    }
  },
  login: async (req, res) => {
    console.log(req.body);
    const { username, password } = req.body;
    try {
      const userExist = await User.findOne({ username });
      console.log(userExist);
      if (!userExist) {
        return res.status(STATUS_CODE.Bad_Request).json({
          status: false,
          message:
            "Incorrect username or password... enter correct crendential",
        });
      }
      const isMatched = await bcrypt.compare(password, userExist.password);
      console.log(isMatched);
      if (!isMatched) {
        return res.status(STATUS_CODE.Bad_Request).json({
          status: false,
          message:
            "Incorrect username or password... enter correct crendential",
        });
      }
      const payload = {
        id: userExist._id,
        username: userExist.username,
      };
      const secretOrPrivateKey = process.env.SECRET_PRIVATE_KEY;

      const token = jwt.sign(payload, secretOrPrivateKey, { expiresIn: "1d" });

      res.setHeader(
        "Set-Cookie",
        cookie.serialize("token", token, {
          httpOnly: true,
          maxAge: 86400, // Expires in 1 day (1d * 24h * 60m * 60s)
          path: "/",
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
        })
      );

      res.status(STATUS_CODE.Success).json({
        status: true,
        message: "User has been successfully logged in.",
      });
    } catch (error) {
      console.log(error);
      res.status(STATUS_CODE.Internal).json({
        status: false,
        message: "Something went wrong try again...",
        error,
      });
    }
  },
  logout: (req, res) => {
    res.clearCookie("token");
    console.log("Logging out the user");
    res.redirect("/");
  },
};

module.exports = Auth;
