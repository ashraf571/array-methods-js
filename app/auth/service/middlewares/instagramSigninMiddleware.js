'use strict';

const _ = require('lodash');
const ES = require('../../../base/response/responseService');

module.exports = (req, res, next) => {
    if (!_.get(req, 'body.instagramId')) return next(ES.errorMessage('InstagramId is required'));
    return next();
};
