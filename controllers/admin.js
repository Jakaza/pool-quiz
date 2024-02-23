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
        .json({ status: true, message: "Category added successfully" });
    } catch (error) {
      console.error("Failed to add category:", error);
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ status: false, message: "Failed to add category" });
    }
  },
  editCategory: async (req, res) => {
    try {
      const { categoryId } = req.params;
      const category = await Category.findOne({ _id: categoryId });
      if (!category) {
        return res
          .status(StatusCodes.NOT_FOUND)
          .json({ status: false, message: "Category not found" });
      }
      category.title = req.body.title || category.title;
      category.description = req.body.description || category.description;
      category.isVisible = req.body.isVisible ?? category.isVisible;
      await category.save();
      res
        .status(StatusCodes.OK)
        .json({ status: true, message: "Category edited successfully" });
    } catch (error) {
      console.error("Failed to edit category:", error);
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ status: false, message: "Failed to edit category" });
    }
  },
  toggleUserBlockStatus: async (req, res, isBlocked) => {
    try {
      const { userId } = req.params;
      const user = await User.findById(userId);
      if (!user) {
        return res
          .status(StatusCodes.NOT_FOUND)
          .json({ status: false, message: "User not found" });
      }
      user.blocked = isBlocked;
      await user.save();
      const action = isBlocked ? "blocked" : "unblocked";
      res
        .status(StatusCodes.OK)
        .json({ status: true, message: `User ${action} successfully` });
    } catch (error) {
      console.error("Failed to toggle user block status:", error);
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ status: false, message: "Failed to toggle user block status" });
    }
  },
  blockUser: async (req, res) => {
    await SuperAdmin.toggleUserBlockStatus(req, res, true);
  },
  unBlockUser: async (req, res) => {
    await SuperAdmin.toggleUserBlockStatus(req, res, false);
  },
  makeUserAdmin: async (req, res) => {
    try {
      const { userId } = req.params;
      const user = await User.findById(userId);
      if (!user) {
        return res
          .status(StatusCodes.NOT_FOUND)
          .json({ status: false, message: "User not found" });
      }
      user.role = "ADMIN";
      await user.save();
      res
        .status(StatusCodes.OK)
        .json({ status: true, message: "User promoted to admin successfully" });
    } catch (error) {
      console.error("Failed to promote user to admin:", error);
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ status: false, message: "Failed to promote user to admin" });
    }
  },
};

module.exports = SuperAdmin;
