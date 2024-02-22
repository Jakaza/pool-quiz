const express = require("express");
const router = express.Router();
const authUser = require("./config/auth");
const Auth = require("./controllers/auth");
const Page = require("./controllers/page");
const Question = require("./controllers/question");
const isUserLoggedIn = require("./utils/checkLogin");
const SuperAdmin = require("./controllers/admin");

// auth user
router.post("/register", Auth.register);
router.post("/login", Auth.login);
router.get("/logout", Auth.logout);
// router.post('/verify', Auth.verifyEmail)
// router.post('/reset-password', Auth.resetPassword)
// router.post('/refresh-token', Auth.refreshToken)

// rendering pages - ejs
router.get("/", isUserLoggedIn, Page.homePage);
router.get("/add-question", isUserLoggedIn, Page.addQuestion);
router.get("/register", Page.registerUser);
router.get("/api-setting", isUserLoggedIn, Page.settings);
router.get("/login", Page.login);
router.get("/edit-question/:questionId/:questionType", Page.editQuestion);
router.get("/browse", Page.browse);
router.get("/profile", Page.profile);
router.get("/policy", Page.policy);
router.get("/terms", Page.terms);
router.get("/dashboard", Page.adminHomePage);

// question api
router.post("api/choice-question", authUser, Question.createChoiceQuestion);
router.post("api/binary-question", authUser, Question.createBinaryQuestion);
router.put("api/update-question/:questionId", authUser, Question.update);
router.delete("api/delete-question/:questionId", authUser, Question.delete);
router.delete("api/remove-question/:questionId", authUser, Question.remove);
// https://opentdb.com/api.php?amount=10&category=23&difficulty=hard&type=multiple
router.get("/generate-url", Question.generateURL);
router.get("/questions", Question.getAllQuestions);

// admin | SuperAdmin
router.post("/add-category", SuperAdmin.createCategory);
router.post("/edit-category/:categoryId", SuperAdmin.editCategory);
router.post("/users/block/:userId", SuperAdmin.blockUser);
router.post("/users/unblock/:userId", SuperAdmin.unBlockUser);

module.exports = router;
