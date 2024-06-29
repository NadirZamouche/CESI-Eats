const express = require('express');
const uploadRoutes = require('./routes/uploadRoutes');
const cors = require('cors')
const app = express();
app.use(cors())

app.use(express.json());
app.use('/uploads', express.static('uploads'));

app.use('/api/uploads', uploadRoutes);

const PORT = 5010;
app.listen(PORT, () => {
    console.log(`Image service running on port ${PORT}`);
});
