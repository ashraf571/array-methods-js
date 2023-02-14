'use strict';

const _ = require('lodash');
const ES = require('../../../base/response/responseService');

module.exports = (req, res, next) => {
    if (_.get(req, 'body.email')) return next(ES.errorMessage('Not able to change: email'));
    if (_.get(req, 'body.password')) return next(ES.errorMessage('Unknown parameter: password'));
    if (_.get(req, 'body.role')) return next(ES.errorMessage('Not able to change: role'));
    return next();
};
