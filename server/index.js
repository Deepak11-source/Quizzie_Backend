const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
const PORT = process.env.PORT || 5000;

const connectDB = require("./connection/connectDB");
const authRoutes = require("./routes/authentication");
const quizRoutes = require("./routes/quiz");

app.use(express.json());
app.use(cors({ origin: "*" }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", async (req, res) => {
  res.status(200).json("Server is up and running");
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal Server Error" });
});

app.set("view engine", "ejs");

connectDB();
app.use("/api/auth", authRoutes);
app.use("/api/quiz", quizRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
