const { StatusCodes } = require("http-status-codes");
const User = require("../models/user");
const Category = require("../models/Category");

const SuperAdmin = {
  createCategory: async (req, res) => {
    const category = new Category(req.body);
    try {
      await category.save();
      res
        .status(StatusCodes.OK)
        .json({ status: true, message: "Question added successfully" });
    } catch (err) {
      console.log(err);
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ status: false, message: "Failed to add question" });
    }
  },
  editCategory: async (req, res) => {
    try {
      const { categoryId } = req.params;
      const category = await Category.findOne({ _id: categoryId });
      category.title = req.body?.title ?? category.title;
      category.description = req.body?.description ?? category.description;
      category.isVisible = req.body?.isVisible ?? category.isVisible;
      await category.save();
      res
        .status(StatusCodes.OK)
        .json({ status: true, message: "Question edited successfully" });
    } catch (error) {
      console.error(error);
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ status: false, message: "Failed to edit question" });
    }
  },
  unPublishQuestion: async (req, res) => {
    try {
      const { questionId } = req.params;
      // Fetch question from database and update its status to unpublished
      // Example:
      // const question = await Question.findById(questionId);
      // question.published = false;
      // await question.save();
      res
        .status(StatusCodes.OK)
        .json({ status: true, message: "Question unpublished successfully" });
    } catch (error) {
      console.error(error);
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ status: false, message: "Failed to unpublish question" });
    }
  },
  blockUser: async (req, res) => {
    try {
      const { userId } = req.params;
      // Fetch user from database and update its status to blocked
      // Example:
      // const user = await User.findById(userId);
      // user.blocked = true;
      // await user.save();
      res
        .status(StatusCodes.OK)
        .json({ status: true, message: "User blocked successfully" });
    } catch (error) {
      console.error(error);
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ status: false, message: "Failed to block user" });
    }
  },
  unBlockUser: async (req, res) => {
    try {
      const { userId } = req.params;
      // Fetch user from database and update its status to unblocked
      // Example:
      // const user = await User.findById(userId);
      // user.blocked = false;
      // await user.save();
      res
        .status(StatusCodes.OK)
        .json({ status: true, message: "User unblocked successfully" });
    } catch (error) {
      console.error(error);
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ status: false, message: "Failed to unblock user" });
    }
  },
  updateUser: async (req, res) => {
    try {
      const { userId } = req.params;
      const { username, email } = req.body;
      // Fetch user from database and update its details
      // Example:
      // const user = await User.findById(userId);
      // user.username = username;
      // user.email = email;
      // await user.save();
      res
        .status(StatusCodes.OK)
        .json({ status: true, message: "User updated successfully" });
    } catch (error) {
      console.error(error);
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ status: false, message: "Failed to update user" });
    }
  },
  makeUserAdmin: async (req, res) => {
    try {
      const { userId } = req.params;
      // Fetch user from database and update its role to admin
      // Example:
      // const user = await User.findById(userId);
      // user.role = 'admin';
      // await user.save();
      res
        .status(StatusCodes.OK)
        .json({ status: true, message: "User promoted to admin successfully" });
    } catch (error) {
      console.error(error);
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ status: false, message: "Failed to promote user to admin" });
    }
  },
};

module.exports = SuperAdmin;
