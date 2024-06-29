const jwt = require('jsonwebtoken');
require('dotenv').config();

const authMiddleware = (req, res, next) => {
    const accessToken = req.header("accessToken") // Get accessToken from the accessToken header

    if (!accessToken) {
        return res.status(401).json({ error: 'Access denied. No accessToken provided.' });
    }

    try {
        const decoded = jwt.verify(accessToken, process.env.JWT_SECRET_KEY);
        req.user = decoded; // Store the decoded user info in the request object
        next();
    } catch (error) {
        res.status(400).json({ error: 'Invalid accessToken.' });
    }
};

module.exports = authMiddleware;
