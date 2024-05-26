const Quiz = require("../models/quiz");
const mongoose = require("mongoose");

const createQuiz = async (req, res) => {
  const { quizName, quizType, optionType, createdBy, timer, questions } = req.body;
  if (!quizName || !quizType || !optionType || !createdBy || timer == null || !Array.isArray(questions)) {
    return res.status(400).json({ message: "Invalid request data" });
  }
  try {
    const quiz = await Quiz.create({
      quizName,
      quizType,
      optionType,
      createdBy,
      timer,
      questions,
    });
    await quiz.save();
    return res.status(201).json({ message: "Quiz created successfully", quiz });
  } catch (error) {
    console.error('Error creating quiz:', error);
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

const getQuizByID = async (req, res) => {
  const { quizId } = req.params;
  try {
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }
    return res.status(200).json({ message: "Quiz found", quiz });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getAllQuiz = async (req, res) => {
  try {
    const { createdBy } = req.query;
    const quizzes = await Quiz.find({ createdBy });
    if (quizzes.length === 0) {
      return res
        .status(404)
        .json({ message: "No quizzes found for this user" });
    }
    return res.status(200).json({ message: "Quizzes found", quizzes });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getTrendingQuizzes = async (req, res) => {
  try {
    const { createdBy } = req.query;
    const filteredQuizzes = await Quiz.find({
      createdBy,
      impression: { $gte: 10 },
    }).sort({ impression: -1 });
    if (filteredQuizzes.length === 0) {
      return res.status(404).json({ message: "No trending quizzes found" });
    }
    return res.status(200).json({ filteredQuizzes });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const editQuiz = async (req, res) => {
  const { id } = req.params;
  const { questions, timer, optionType } = req.body;
  try {
    const updateData = {};
    if (questions !== undefined) {
      updateData.questions = questions;
    }
    if (timer !== undefined) {
      updateData.timer = timer;
    }
    if (optionType !== undefined) {
      updateData.optionType = optionType;
    }
    const quiz = await Quiz.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });
    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }
    return res.status(200).json({ message: "Quiz updated successfully", quiz });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const deleteQuiz = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedQuiz = await Quiz.findByIdAndDelete(id);
    if (!deletedQuiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }
    return res.status(200).json({ message: "Quiz deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const increaseAttemptsAndCounts = async (req, res) => {
  try {
    const { id } = req.params;
    const newQuestions = req.body;
    if (newQuestions) {
      const updatedQuizData = await Quiz.findByIdAndUpdate(
        id,
        { questions: newQuestions },
        { new: true }
      );
      if (!updatedQuizData) {
        return res.status(404).json({ message: "Quiz not found" });
      }
      return res.status(200).json({
        message: "Quiz updated successfully",
        updatedQuizData,
      });
    } else {
      return res.status(400).json({ message: "No data provided to update" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const increaseImpressions = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(404).json({ message: "Quiz ID not provided" });
    }

    const updatedQuizData = await Quiz.findByIdAndUpdate(
      id,
      { $inc: { impression: 1 } },
      { new: true }
    );

    if (!updatedQuizData) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    return res.status(200).json({ message: "Impression updated" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  createQuiz,
  getQuizByID,
  getAllQuiz,
  getTrendingQuizzes,
  editQuiz,
  deleteQuiz,
  increaseAttemptsAndCounts,
  increaseImpressions,
};