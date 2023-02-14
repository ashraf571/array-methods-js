'use strict';

const express = require('express');
const router = express.Router();
const authService = require('../service/authService');
const userAuthMiddleware = require('../service/middlewares/userAuthMiddleware');
const facebookSigninMiddleware = require('../service/middlewares/facebookSigninMiddleware');
const googleSigninMiddleware = require('../service/middlewares/googleSigninMiddleware');
const instagramSigninMiddleware = require('../service/middlewares/instagramSigninMiddleware');

// Admin login
router.post('/admin/login', userAuthMiddleware, (req, res, next) => {
    return authService.adminLogin(req.body)
        .then(data => {
            return res.send(data);
        }, err => next(err));
});

// Anonymous user signup
router.post('/signup', (req, res, next) => {
    return authService.anonymousSignup()
        .then(data => {
            return res.send(data);
        }, err => next(err));
});

// User signup
router.post('/user/signup', userAuthMiddleware, (req, res, next) => {
    return authService.userSignup(req.body)
        .then(data => {
            return res.send(data);
        }, err => next(err));
});

// User login
router.post('/user/login', userAuthMiddleware, (req, res, next) => {
    return authService.userLogin(req.body)
        .then(data => {
            return res.send(data);
        }, err => next(err));
});

// Signin by facebook
router.post('/facebooksignin', facebookSigninMiddleware, (req, res, next) => {
    const socialType = 'facebook';
    return authService.socialSignin(req.body, socialType)
        .then(data => {
            return res.send(data);
        }, err => next(err));
});

// Signin by google
router.post('/googlesignin', googleSigninMiddleware, (req, res, next) => {
    const socialType = 'google';
    return authService.socialSignin(req.body, socialType)
        .then(data => {
            return res.send(data);
        }, err => next(err));
});

// Signin by instagram
router.post('/instagramsignin', instagramSigninMiddleware, (req, res, next) => {
    const socialType = 'instagram';
    return authService.socialSignin(req.body, socialType)
        .then(data => {
            return res.send(data);
        }, err => next(err));
});

module.exports = router;
