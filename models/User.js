const mongoose = require('mongoose');
const validator = require('validator');


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        validate: [validator.isEmail, "Please enter valid email"],
        unique: true
    },
    dob: {
        type: String,
    
    },
    uid: {
        type: String,
    
    },
    mobile : { 
        type : Number,
        
    },
    userId : {
        type: String,
        required: true
    },
    bookings: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order"
    }],
    role: {
        type: String,
        default: 'user',
        enum: ['user', 'admin']
    }
}, { timestamps: true });


const User = mongoose.model("Users", userSchema);

module.exports = User;