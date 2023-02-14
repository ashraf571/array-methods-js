'use strict';

const express = require('express');
const router = express.Router();
const authRoute = require('../../auth/route/api');
const authMiddleware = require('../service/middlewares/authMiddleware');
const profileRoute = require('../../user/route/api');
const array_methods = require('../../array-methods/route')


/*
 * authentication api
 */
router.use('/auth', authRoute);
router.use('/array-methods', array_methods);

/*
 * middleware for all below api's
 */
router.use(authMiddleware);

/*
 * other api's
 */
router.use('/user', profileRoute);

module.exports = router;
