'use strict';

const _ = require('lodash');
const ER = require('../../../base/response/responseService');

module.exports = (req, res, next) => {
    if (!_.get(req, 'body.email')) return next(ER.errorMessage('Email is required'));
    if (!_.get(req, 'body.password')) return next(ER.errorMessage('Password is required'));
    return next();
};
