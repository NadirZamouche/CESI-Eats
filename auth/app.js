const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');
const mongoose = require('mongoose');
const userRoutes = require('./routes/userRoutes'); // Import the user routes
const loginRoutes = require('./routes/loginRoutes'); // Import the login routes
const authMiddleware = require('./middlewares/authMiddleware'); // Import the auth middleware


const db = require("./SQLmodels");

const app = express();

mongoose.connect('mongodb://mongo:27017/clientdb')
// mongoose.connect('mongodb://mongo:27017/clientdb')
.then(() => console.log('MongoDB connected...'))
.catch(err => console.log(err));

db.sequelize.sync()
.then(() => console.log('MySQL connected...'))
.catch(err => console.log(err));

const services = [
    { path: '/enduser', target: 'http://localhost:5001' },
    { path: '/restaurateur', target: 'http://localhost:5002' },
    { path: '/delivery', target: 'http://localhost:5003' },
    { path: '/developer', target: 'http://localhost:5004' },
    { path: '/commercial', target: 'http://localhost:5005' },
    { path: '/technical', target: 'http://localhost:5006' }
];
const servicesDocker = [
    { path: '/enduser', target: 'http://enduser-backend:5001' },
    { path: '/restaurateur', target: 'http://restaurateur-backend:5002' },
    { path: '/delivery', target: 'http://delivery-backend:5003' },
    { path: '/developer', target: 'http://developer-backend:5004' },
    { path: '/commercial', target: 'http://commercial-backend:5005' },
    { path: '/technical', target: 'http://technical-backend:5006' }
];

// Enable CORS
app.use(cors({
    origin: [
        'http://localhost:3001', 
        'http://localhost:3002', 
        'http://localhost:3003', 
        'http://localhost:3004', 
        'http://localhost:3005', 
        'http://localhost:3006', 
        'http://enduser-frontend:3001', 
        'http://restaurateur-frontend:3002', 
        'http://delivery-frontend:3003', 
        'http://developer-frontend:3004', 
        'http://commercial-frontend:3005', 
        'http://technical-frontend:3006', 
        'http://localhost:5010'
    ], // Update with your frontend URLs
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    allowedHeaders: ['Content-Type', 'authenticated', 'apiKey', 'accessToken', 'role'] // Add 'authenticated' header
}));

// // Middleware to parse JSON bodies
app.use(express.json());

// API verification middleware


// // Logging middleware
// app.use((req, res, next) => {
//     console.log(`Received request: ${req.method} ${req.url}`);
//     next();
// });

// // Public routes (login and signup)
app.use("/api", loginRoutes);
app.use("/api/user", userRoutes);
// // Authentication middleware for protected routes
// const userPath = ['/enduser/api/users', '/restaurateur/api/users', '/delivery/api/users', '/developer/api/users', '/commercial/api/users', '/technical/api/users'];
// userPath.forEach(path => {
//     app.use(path, authMiddleware, userRoutes);
// });

// // Proxy setup with authentication middleware and user info in headers
// services.forEach(service => {
//     app.use(service.path, authMiddleware, (req, res, next) => {
//         createProxyMiddleware({
//             target: service.target,
//             changeOrigin: true,
//             pathRewrite: { [`^${service.path}`]: '' },
//             onProxyReq: (proxyReq, req) => {
//                 if (req.user) {
//                     proxyReq.setHeader('x-user-id', req.user.id);
//                     proxyReq.setHeader('x-user-email', req.user.email);
//                     proxyReq.setHeader('x-user-role', req.user.role);
//                 }
//                 if (req.body) {
//                     const bodyData = JSON.stringify(req.body);
//                     proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
//                     proxyReq.write(bodyData);
//                 }
//             }
//         })(req, res, next);
//     });
// });



const PORT = 5007;
app.listen(PORT, () => {
    console.log(`Auth running on port ${PORT}`);
});
