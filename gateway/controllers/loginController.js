const { users } = require('../SQLmodels');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config(); // Ensure you have dotenv configured

const saltRounds = 10;

exports.signup = async (req, res) => {
    try {
        const role = req.originalUrl.split('/')[1]; // Extract the role from the URL

        const { first_name, last_name, phone, email, password, state } = req.body;
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Create the user
        // const user = await users.create({ first_name, last_name, phone, email, password: hashedPassword, role, state });
        res.status(201).json({ message: 'User created successfully', user });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        const role = req.originalUrl.split('/')[1]; // Extract the role from the URL
        const { email, password } = req.body;

        // Find the user
        const user = await users.findOne({
            where: {
                email: email,
                role: role
            }
        });

        // Check if user exists and password is correct
        if (user && await bcrypt.compare(password, user.password)) {
            // Generate a JWT accessToken
            const accessToken = jwt.sign(
                { 
                    id: user.id,
                    first_name: user.first_name,
                    last_name: user.last_name,
                    phone: user.phone,
                    email: user.email,
                    role: user.role
                },
                process.env.JWT_SECRET_KEY, // Use an environment variable for the secret key
            );

            

            // Send the response
            res.status(200).json({ message: 'Login successful', accessToken, userInfo: user });
        } else {
            res.status(401).json({ error: 'Invalid email, password, or role' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.checkAuth = (req, res) => {
    const accessToken = req.header("accessToken") // Get accessToken from the accessToken header
    if (!accessToken) {
        return res.status(401).json({ error: 'Access denied. No accessToken provided.' });
    }

    try {
        const decoded = jwt.verify(accessToken, process.env.JWT_SECRET_KEY);
        res.status(200).json({ valid: true, user: decoded });
    } catch (error) {
        res.status(400).json({ valid: false, error: 'Invalid accessToken.' });
    }
};
