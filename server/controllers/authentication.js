const User = require('../models/authentication');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();
const jwtSecret = process.env.JWT_SECRET;

const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Please provide all the required fields' });
        }
        const emailExist = await User.findOne({ email });
        if (emailExist) {
            return res.status(400).json({ message: 'Email already exists' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ name, email, password: hashedPassword });
        await user.save();        
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: 'Please provide all the required fields' });
        }
        const user = await User.findOne({ email });
        if (user) {
            const passwordMatch = await bcrypt.compare(password, user.password);
            if (!passwordMatch) {
                return res.status(400).json({ message: 'Invalid password' });
            }
            const token = jwt.sign({ userId: user._id }, jwtSecret);
            return res.status(200).json({ message: 'Login successful', token });
        } else {
            return res.status(400).json({ message: 'User does not exist. Please register.' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

module.exports = {
    register,
    login
}
