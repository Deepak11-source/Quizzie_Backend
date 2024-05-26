const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();
const jwtSecret = process.env.JWT_SECRET;

const isAuthenticated = (req, res, next) => {
    try {
        const authorizationHeader = req.headers.authorization;
        if (!authorizationHeader) {
            return res.status(401).json({ message: "Authorization header is missing" });
        }
        const token = authorizationHeader.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: "Token is missing" });
        }
        const decoded = jwt.verify(token, jwtSecret);
        req.user = decoded;
        next();
    } catch (error) {
        console.error(error);
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: "Invalid token" });
        } else if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: "Token has expired" });
        } else {
            return res.status(500).json({ message: "Internal server error" });
        }
    }
};

module.exports = isAuthenticated;
