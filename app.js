const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path');

const app = express();

// Config
if (process.env.NODE_ENV !== "production") {
    require('dotenv').config({ path: "config/config.env" });
}

// Routes import
const userRoute = require('./routes/userRoute');
const orderRoute = require('./routes/orderRoute');
const errorMiddleware = require('./middlewares/errorMiddleware');

// Middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cookieParser());

app.use(require('cors')({
    origin: '*',
    credentials: true,
}));

// API Routes
app.use('/api/v1', userRoute);
app.use('/api/v1', orderRoute);

// Serve static files
app.use(express.static(path.join(__dirname, "../frontend/build")));

// Custom GET endpoint
app.get('/api/v1/test', (req, res) => {
    res.json({ message: 'This is a test endpoint!' });
});

// Catch-all route for non-API routes
app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, "../frontend/build/index.html"));
});

// Error middleware
app.use(errorMiddleware);

module.exports = app;
