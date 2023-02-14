'use strict';

const express = require('express');
const router = express.Router();
const appRoutes = require('./api');

router.use('/api', appRoutes);

router.get('/', (req, res, next) => {
    res.send('welcome!');
});

module.exports = router;
