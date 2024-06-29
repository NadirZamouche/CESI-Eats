const { users } = require('../SQLmodels');
const Restaurateur = require('../models/Restaurateur');
const Client = require('../models/Client');
const Delivery = require('../models/Delivery');
const Log = require('../models/Log');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config(); // Ensure you have dotenv configured
const crypto = require('crypto');

const saltRounds = 10;

exports.signup = async (req, res) => {
    try {
        const role = req.headers.role; // Extract the role from the URL
        const { first_name, last_name, phone, email, password, address, sponsorship_code_used, name } = req.body;
        const randomHash = crypto.randomBytes(12).toString('base64').slice(0, 12)
        
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Create the user
        const user = await users.create({ first_name, last_name, phone, email, password: hashedPassword, role, state: true });
        if(role=== 'restaurateur' || role=== 'enduser' || role=== 'delivery'){
            console.log(role)
            let account;
            switch (role) {
                case 'restaurateur':
                    account = new Restaurateur({ ID_user: user.id, sponsorship_code_owned: randomHash, sponsorship_code_used: sponsorship_code_used || 'none', address, name });
                    break;
                case 'enduser':
                    account = new Client({ ID_user: user.id, sponsorship_code_owned: randomHash, sponsorship_code_used: sponsorship_code_used || 'none', address });
                    break;
                case 'delivery':
                    account = new Delivery({ ID_user: user.id, sponsorship_code_owned: randomHash, sponsorship_code_used: sponsorship_code_used || 'none' });
                    break;
                
            }
        
            account.save()
        }
        const log = new Log({ value: `A new account with the email: ${email} and the role: ${role} has been created`, type: "authentication"});
        await log.save();
        res.status(201).json({ message: 'User created successfully',randomHash });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};



exports.login = async (req, res) => {
    try {
        const role = req.headers.role; // Extract the role from the URL
        const { email, password } = req.body;

        // Find the user
        const user = await users.findOne({
            where: {
                email: email,
                role: role
            }
        });
        if (user.state===false) {
           return res.json({ error: 'This account is disabled' });
        }
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

            
            const log = new Log({ value: `${email} with the role: ${role} has logged in`, type: "authentication"});
            await log.save();
            // Send the response
            res.status(200).json({ message: 'Login successful', accessToken, userInfo: user });
        } else {
            res.json({ error: 'Invalid email, password, or role' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.checkAuth = (req, res) => {
    const role = req.headers.role; // Extract the role from the URL
    const accessToken = req.header("accessToken") // Get accessToken from the accessToken header
    if (!accessToken) {
        return res.status(401).json({ error: 'Access denied. No accessToken provided.' });
    }

    try {
        const decoded = jwt.verify(accessToken, process.env.JWT_SECRET_KEY);
        if(role!== decoded.role){
            return res.status(401).json({ error: 'Access denied. The role is unvalid.' });
        }
        res.status(200).json({ valid: true, user: decoded });
    } catch (error) {
        res.status(400).json({ valid: false, error: 'Invalid accessToken.' });
    }
};
