const mongoose = require("mongoose");
const questionSchema = require('./question');

const quizSchema = new mongoose.Schema(
  {
    quizName: { type: String, required: true },
    quizType: { type: String, enum: ["Q&A", "Poll"], required: true },
    optionType: { type: String },
    impression: { type: Number, default: 0 },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    questions: [questionSchema], 
    timer: { type: Number },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Quiz", quizSchema);
