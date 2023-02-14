'use strict';

const jwt = require('jsonwebtoken');
const RS = require('../../response/responseService');
module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        req.user = decoded;
        return next();
    } catch (error) {
        return Promise.reject(RS.errorMessage('Auth failed'));
    }
};
