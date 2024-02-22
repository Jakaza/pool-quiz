const mongoose = require("mongoose");

const trueFalseQuestionSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: true,
    },
    correctAnswer: {
      type: Boolean,
      required: true,
    },
    references: String,
    difficulty: {
      type: String,
      required: true,
      enum: ["EASY", "MEDIUM", "HARD"],
      default: "EASY",
      index: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      index: true,
    },
    type: {
      type: String,
      required: true,
      default: "truefalse",
    },
    isPublic: {
      type: Boolean,
      required: true,
      default: false,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("TrueFalseQuestion", trueFalseQuestionSchema);
