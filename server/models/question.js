const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  questionText: { type: String, required: true },
  options: [
    {
      optionText: { type: String },
      optionImage: { type: String },
      count: { type: Number, default: 0 },
    },
  ],
  attempt: { type: Number, default: 0 },
  correctOptionIndex: { type: Number },
  correct: { type: Number, default: 0 },
});

module.exports = questionSchema;