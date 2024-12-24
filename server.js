const express = require('express');
const dotenv = require('dotenv');
const dbConnect = require('./config/db');
// const swaggerDocs = require('./config/swagger');
const authRoutes = require('./routes/authRoutes');
const urlRoutes = require('./routes/urlRoutes');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());

// Connect to DB
dbConnect();

// Routes
app.use('/auth', authRoutes);
app.use('/api', urlRoutes);

// Swagger Documentation
// swaggerDocs(app);

// Start Server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
