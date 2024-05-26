const express = require("express");
const router = express.Router();
const { createQuiz, getQuizByID, getAllQuiz, getTrendingQuizzes, editQuiz, deleteQuiz, increaseAttemptsAndCounts, increaseImpressions } = require("../controllers/quiz");
const  isAuthenticated  = require("../middlewares/isAuthenticated");

router.post("/create", isAuthenticated, createQuiz);
router.get("/getQuizByID/:quizId", getQuizByID);

router.get("/getAllQuiz", isAuthenticated, getAllQuiz);
router.get("/getTrendingQuizzes", isAuthenticated, getTrendingQuizzes);

router.put("/editQuiz/:id", isAuthenticated, editQuiz);
router.delete("/deleteQuiz/:id", isAuthenticated, deleteQuiz);
router.patch("/increaseAttemptsAndCounts/:id",  increaseAttemptsAndCounts);
router.patch("/increaseImpressions/:id",  increaseImpressions);

module.exports = router;