const passport = require("passport");
const cookie = require("cookie");
const { ROLES } = require("../constants/");
const Category = require("../models/Category");

const Page = {
  adminHomePage: (req, res, next) => {
    passport.authenticate(
      "jwt",
      { session: false },
      async (err, user, info) => {
        if (err) {
          return res.status(500).render("server_error");
        }
        if (!user) {
          return res.render("index", { isAuthenticated: false });
        }
        if (user.roles == ROLES.SuperAdmin) {
          const categories = await Category.find();
          categories.forEach((category) => {
            category.id = String(category._id);
          });
          return res.render("admin/dashboard", {
            isAuthenticated: req.isAuthenticated,
            user: user,
            categories: categories,
          });
        }
        res.redirect("/");
      }
    )(req, res, next);
  },
  adminQuestionPage: (req, res, next) => {
    passport.authenticate(
      "jwt",
      { session: false },
      async (err, user, info) => {
        if (err) {
          return res.status(500).render("server_error");
        }
        if (!user) {
          return res.render("index", { isAuthenticated: false });
        }
        if (user.role == ROLES.SuperAdmin || user.role == ROLES.Admin) {
          const questions = await fetchQuestions(MultipleChoiceQuestion);
          questions = await fetchQuestions(TrueFalseQuestion);
          return res.render("admin/questions", {
            isAuthenticated: req.isAuthenticated,
            user: user,
            questions: questions,
          });
        }
        res.redirect("/");
      }
    )(req, res, next);
  },
  homePage: (req, res, next) => {
    passport.authenticate("jwt", { session: false }, (err, user, info) => {
      if (err) {
        return res.status(500).render("server_error");
      }
      if (!user) {
        return res.render("index", { isAuthenticated: false });
      }

      if (user.roles == ROLES.SuperAdmin) {
        res.redirect("/dashboard");
      }

      return res.render("index", {
        isAuthenticated: req.isAuthenticated,
        user: user,
      });
    })(req, res, next);
  },

  addQuestion: (req, res, next) => {
    passport.authenticate(
      "jwt",
      { session: false },
      async (err, user, info) => {
        if (err) {
          return res.status(500).render("server_error");
        }
        if (!user) {
          console.log("You cannot access add-question you not authorized");
          return res.status(401).redirect("login");
        }
        const categories = await Category.find();

        if (categories.length <= 0) {
          res.redirect("home");
        }
        return res.render("user/create_question", {
          isAuthenticated: req.isAuthenticated,
          user: user,
          categories: categories,
        });
      }
    )(req, res, next);
  },
  editQuestion: (req, res, next) => {
    passport.authenticate(
      "jwt",
      { session: false },
      async (err, user, info) => {
        if (err) {
          res.render("error/not_authorized");
        }
        if (!user) {
          res.render("error/not_authorized");
        }
        const { questionId, questionType } = req.params;
        const question = "";
        if (questionType === "multiple") {
          question = await MultipleChoiceQuestion.findOne({ _id: questionId });
        } else {
          question = await TrueFalseQuestion.findOne({ _id: questionId });
        }
        question
          ? res.render("user/edit_question", {})
          : res.redirect("/profile");
      }
    )(req, res, next);
  },
  browse: (req, res, next) => {
    const cookies = req.headers.cookie || "";
    const tokenCookie = cookie.parse(cookies).token;

    if (!tokenCookie) {
      console.log("No token found. Redirecting to login.");
      return res.status(401).redirect("/login");
    }

    passport.authenticate("jwt", { session: false }, (err, user, info) => {
      if (err) {
        return res.status(500).json({ error: "Internal Server Error" });
      }
      if (!user) {
        return res.status(401).redirect("login");
      }
      console.log(user);
      return res.render("user/browse", { isAuthenticated: true, user: user });
    })(req, res, next);
  },
  profile: (req, res, next) => {
    const cookies = req.headers.cookie || "";
    const tokenCookie = cookie.parse(cookies).token;

    if (!tokenCookie) {
      console.log("No token found. Redirecting to login.");
      return res.render("index", { isAuthenticated: false });
    }

    passport.authenticate(
      "jwt",
      { session: false },
      async (err, user, info) => {
        if (err) {
          return res.status(500).json({
            status: false,
            message: "Internal Server Error",
          });
        }

        if (!user) {
          console.log("Info : ", info);
        }

        const userUnverifiedQuestions = await fetchQuestions(user, false);
        const userVerifiedQuestions = await fetchQuestions(user, true);

        console.log("userVerifiedQuestions : ", userVerifiedQuestions);
        console.log("userUnverifiedQuestions : ", userUnverifiedQuestions);
        const data = {
          username: user.username,
          quizLimit: user.quizlimit,
          totalQuiz: user.createdQuestions.length,
          quizleft: user.quizlimit - user.createdQuestions.length,
          role: user.roles,
          userUnverifiedQuestions: userUnverifiedQuestions,
          userVerifiedQuestions: userVerifiedQuestions,
          userUnverifiedTotal: userUnverifiedQuestions.length,
          userVerifiedTotal: userVerifiedQuestions.length,
        };

        res.render("profile", data);
      }
    )(req, res, next);
  },
  registerUser: (req, res) => {
    res.render("auth/register");
  },
  settings: (req, res) => {
    res.render("user/setting");
  },
  login: (req, res) => {
    res.render("auth/login");
  },
  policy: (req, res) => {
    res.render("legal/policy");
  },
  terms: (req, res) => {
    res.render("legal/terms");
  },
};

module.exports = Page;
