const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path');


const app = express();


// config
if (process.env.NODE_ENV !== "PRODUCTION") {
    require('dotenv').config({ path: "config/config.env" })
}

// Routes import
const userRoute = require('./routes/userRoute');
const orderRoute = require('./routes/orderRoute');
const errorMiddleware = require('./middlewares/errorMiddleware');

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

app.use(cookieParser());


app.use(require('cors')({
    origin: '*',
    credentials: true,
}));

app.use('/api/v1', userRoute);
app.use('/api/v1', orderRoute);

app.use(express.static(path.join(__dirname + "./../frontend/build")));

app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, "./../frontend/build/index.html"));
})

// error middileware
app.use(errorMiddleware)






module.exports = app;