const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("./catchAsyncErrors");
const jwt = require('jsonwebtoken');
const User = require("../models/User");

const admin = require('firebase-admin');

exports.isAuthenticatedUser = catchAsyncErrors(async (req, res, next) => {
    const { authorization } = req.headers;

    if (!authorization || !authorization.startsWith('Bearer ')) {
        return next(new ErrorHandler('Please login to access this resource.', 401));
    }

    const token = authorization.split(' ')[1];

    try {
        const decodedToken = await admin.auth().verifyIdToken(token);
        const uid = decodedToken.uid;

        const user = await User.findOne({ uid });

        if (!user) {
            return next(new ErrorHandler('User not found.', 401));
        }

        req.user = user;
        next();
    } catch (error) {
        return next(new ErrorHandler('Invalid token. Please login again.', 401));
    }
});


exports.authorizedRole = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new ErrorHandler(`role: ${req.user.role} is not allowed to access this resource.`, 403));
        }

        next()
    }
}



