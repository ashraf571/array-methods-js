'use strict';

const express = require('express');
const router = express.Router();
const profileService = require('../service/profileService');
const UserStorage = require('../../auth/storage/UserStorage');
const userStorage = new UserStorage();
const updateUserMiddleware = require('../service/middlewares/updateUserMiddleware');
const accessControl = require('../../base/service/middlewares/accessControl');
const addScientistMiddleware = require('../service/middlewares/addScientistMiddleware');
const User = require('../../auth/storage/model/User');

// get users
router.get('/', (req, res, next) => {
    return userStorage.list()
        .then(data => {
            return res.send(data);
        }, err => next(err));
});

// add scientist
router.post('/scientist', addScientistMiddleware, (req, res, next) => {
    return profileService.addScientist(req.body)
        .then(data => {
            return res.send(data);
        }, err => next(err));
});

// Search user
router.get('/search', (req, res, next) => {
    const regex = new RegExp('^' + req.query.name + '.*$', 'i');
    return User.find({ $or: [{ $text: { $search: req.query.name } }, { name: { $regex: regex } }] }, { score: { $meta: 'textScore' } }).sort({
        glowBucks: "desc"
    })
        .then(data => {
            return res.send(data);
        }, err => next(err));
});

// get user by Id
router.get('/:id', (req, res, next) => {
    const userId = req.params.id;
    return profileService.getAUser(userId)
        .then(data => {
            return res.send(data);
        }, err => next(err));
});

// update user and change password
router.put('/:id', updateUserMiddleware, (req, res, next) => {
    const userId = req.params.id;
    return profileService.updateUser(userId, req.body, req.user)
        .then(user => {
            return res.send(user);
        }, err => next(err));
});

// change user role
router.post('/:id/role', accessControl.assertUserIsAdmin, (req, res, next) => {
    const userId = req.params.id;
    return profileService.changeUserRole(userId, req.body.role, req.user)
        .then(data => {
            return res.send(data);
        }, err => next(err));
});

// block user
router.post('/:id/block', accessControl.assertUserIsAdmin, (req, res, next) => {
    const userId = req.params.id;
    return profileService.blockUser(userId, req.user)
        .then(data => {
            return res.send(data);
        }, err => next(err));
});

// unblock user
router.post('/:id/unblock', accessControl.assertUserIsAdmin, (req, res, next) => {
    const userId = req.params.id;
    return profileService.unblockUser(userId, req.user)
        .then(data => {
            return res.send(data);
        }, err => next(err));
});
// soft delete user
router.post('/delete', (req, res, next) => {
    return profileService.softDeleteUser(req.user)
        .then(data => {
            return res.send(data);
        }, err => next(err));
});
// reset user
router.post('/reset', (req, res, next) => {
    return profileService.resetUser(req.user)
        .then(data => {
            return res.send(data);
        }, err => next(err));
});
// delete user
router.delete('/:id', accessControl.assertUserIsAdmin, (req, res, next) => {
    const userId = req.params.id;
    return profileService.deleteUser(userId)
        .then(data => {
            return res.send(data);
        }, err => next(err));
});

module.exports = router;
