const express = require('express');
const mongoose = require('mongoose');
const os = require('os');
const db = require("./SQLmodels");
const verifyMicroserviceApiKey = require('./middlewares/verifyMicroserviceApiKey'); // Import the middleware

const articleRoutes = require('./routes/articleRoutes');
const clientRoutes = require('./routes/clientRoutes');
const restaurateurRoutes = require('./routes/restaurateurRoutes');
const menuRoutes = require('./routes/menuRoutes');
const orderRoutes = require('./routes/orderRoutes');
const deliveryRoutes = require('./routes/deliveryRoutes');

const app = express();

mongoose.connect('mongodb://mongo:27017/clientdb')
// mongoose.connect('mongodb://mongo:27017/clientdb')
.then(() => console.log('MongoDB connected...'))
.catch(err => console.log(err));

db.sequelize.sync()
.then(() => console.log('MySQL connected...'))
.catch(err => console.log(err));

app.use(express.json())

// Apply the middleware to all routes
app.use(verifyMicroserviceApiKey);

app.use('/api/articles', articleRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/restaurateurs', restaurateurRoutes);
app.use('/api/menus', menuRoutes);
app.use('/api/order', orderRoutes);
app.use('/api/delivery', deliveryRoutes);

app.get('/api/performance', (req, res) => {
    // RAM consumption
    const totalMem = os.totalmem();
    const freeMem = os.freemem();
    const usedMem = totalMem - freeMem;
    const ramUsage = {
      total: (totalMem / (1024 ** 3)).toFixed(2) + ' GB',
      used: (usedMem / (1024 ** 3)).toFixed(2) + ' GB',
      free: (freeMem / (1024 ** 3)).toFixed(2) + ' GB',
      usagePercentage: ((usedMem / totalMem) * 100).toFixed(2) + ' %'
    };
  
    // CPU consumption
    const cpus = os.cpus();
    const cpuUsage = cpus.map((cpu, index) => {
      const total = Object.values(cpu.times).reduce((acc, tv) => acc + tv, 0);
      const usage = {
        model: cpu.model,
        speed: cpu.speed + ' MHz',
        usage: ((total - cpu.times.idle) / total * 100).toFixed(2) + ' %'
      };
      return { [`CPU ${index}`]: usage };
    });
  
      // Combine all metrics
      const performance = {
        ramUsage,
        cpuUsage,
      };
  
      res.json(performance);
  });

const PORT = 5005;
app.listen(PORT, () => {
    console.log(`Client backend running on port ${PORT}`);
});

