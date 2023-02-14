'use strict';

const mongoose = require('mongoose');
const userFieldValidation = require('../validation/UserFieldValidation');

const userSchema = mongoose.Schema({
    facebookId: {
        type: String
    },
    instagramId: {
        type: String
    },
    googleId: {
        type: String
    },
    name: {
        type: String,
        sparse: true
    },
    userName: {
        type: String,
        unique: true
    },
    email: {
        type: String,
        sparse: true,
        unique: true,
        lowercase: true,
        validate: userFieldValidation.validateEmail(this)
    },
    password: {
        type: String
    },
    deleted: {
        type: Boolean,
        default: false,
    },
    phoneNumber: {
        type: String
    },
    gender: {
        type: String
    },
    userImage: {
        type: String
    },
    glowBites: {
        type: Number
    },
    loggedinAt: {
        type: Date
    },
    // lastSpinTime: {
    //     type: Date
    // },
    canSpin: {
        type: Boolean,
        default: true
    },
    glowPoints: {
        type: Number
    },
    healthPoints: {
        type: Number
    },
    suspend: {
        type: Boolean,
        default: false
    },
    role: {
        type: String,
        default: 'user',
        required: true
    },
    levelNumber: {
        type: Number
    },
    isAnonymous: {
        type: Boolean
    },
    // userName: {
    //     type: String,
    //     unique: true,
    // },
    glowBucks: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

userSchema.index({ name: 'text' });
userSchema.methods.toJSON = function () {
    var obj = this.toObject();
    delete obj.password;
    return obj;
};
const User = mongoose.model('User', userSchema);

module.exports = User;
