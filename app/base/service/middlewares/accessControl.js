'use strict';
const RS = require('../../response/responseService');
const User = require('../../../auth/storage/model/User');
const modelByBaseUrl = {
    '/api/user': User
};

const getIsCreator = req => {
    const resObj = { isCreator: false };
    const Model = modelByBaseUrl[req.baseUrl];
    return Model.findById(req.params.id)
        .then(doc => {
            if (!doc) return Promise.reject(RS.errorMessage('Could not find object.'));
            if (Model.modelName === 'User') {
                resObj.isCreator = (doc._id.toString() === req.user._id.toString());
            } else {
                resObj.isCreator = (doc.user.toString() === req.user._id.toString());
            }
            return Promise.resolve(resObj);
        });
};

const connectionIsCreator = req => {
    const resObj = { isCreator: false };
    return Connection.findOne({ connection: req.params.id, user: req.user._id })
        .then(doc => {
            if (!doc) return Promise.reject(RS.errorMessage('Could not find object.'));
            resObj.isCreator = (doc.user.toString() === req.user._id.toString());
            return Promise.resolve(resObj);
        });
};
const teamIsCreator = req => {
    const resObj = { isCreator: false };
    return Team.findOne({ member: req.params.id, user: req.user._id })
        .then(doc => {
            if (!doc) return Promise.reject(RS.errorMessage('Could not find object.'));
            resObj.isCreator = (doc.user.toString() === req.user._id.toString());
            return Promise.resolve(resObj);
        });
};
const getIsScientist = req => {
    const resObj = { isScientist: false };
    return User.findById(req.user._id)
        .then(doc => {
            if (!doc) return Promise.reject(RS.errorMessage('Could not find object.'));
            if (doc.role && doc.role === 'scientist') {
                resObj.isScientist = true;

                return Promise.resolve(resObj);
            }
            if (!doc) return Promise.reject(RS.errorMessage('Could not find object.'));
            return Promise.resolve(resObj);
        });
};

const getIsAdminAndScientist = req => {
    const resObj = { isAdminAndScientist: false };
    return User.findById(req.user._id)
        .then(doc => {
            if (!doc) return Promise.reject(RS.errorMessage('Could not find object.'));
            if ((doc.role && doc.role === 'admin') || doc.role === 'scientist') {
                resObj.isAdminAndScientist = true;
                return Promise.resolve(resObj);
            }
            if (!doc) return Promise.reject(RS.errorMessage('Could not find object.'));
            return Promise.resolve(resObj);
        });
};

const getIsAdmin = req => {
    const resObj = { isAdmin: false };
    return User.findById(req.user._id)
        .then(doc => {
            if (!doc) return Promise.reject(RS.errorMessage('Could not find object.'));
            if (doc.role && doc.role === 'admin') {
                resObj.isAdmin = true;

                return Promise.resolve(resObj);
            }
            return Promise.resolve(resObj);
        });
};

module.exports = {
    assertUserInParam: (req, res, next) => {
        const userIdInParam = req.params.userId || req.userId;
        if (req.user._id.toString() !== userIdInParam) return next(RS.errorMessage('User does not have permission to this action'));
        return next();
    },
    assertUserIsNotInParam: (req, res, next) => {
        const userIdInParam = req.params.userId || req.userId;
        if (req.user._id.toString() === userIdInParam) return next(RS.errorMessage('User can not perform this action on itself'));
        return next();
    },
    assertUserIsCreator: (req, res, next) => {
        return getIsCreator(req)
            .then(resObj => {
                if (!resObj.isCreator) {
                    return Promise.reject(RS.errorMessage('User does not have access to this action'));
                }
                return Promise.resolve();
            })
            .then(() => next(), err => next(err));
    },
    assertConnectionIsCreator: (req, res, next) => {
        return connectionIsCreator(req)
            .then(resObj => {
                if (!resObj.isCreator) {
                    return Promise.reject(RS.errorMessage('User does not have access to this action'));
                }
                return Promise.resolve();
            })
            .then(() => next(), err => next(err));
    },
    assertTeamIsCreator: (req, res, next) => {
        return teamIsCreator(req)
            .then(resObj => {
                if (!resObj.isCreator) {
                    return Promise.reject(RS.errorMessage('User does not have access to this action'));
                }
                return Promise.resolve();
            })
            .then(() => next(), err => next(err));
    },
    assertUserIsScientist: (req, res, next) => {
        return getIsScientist(req)
            .then(resObj => {
                if (!resObj.isScientist) {
                    return Promise.reject(RS.errorMessage('User does not have access to this action'));
                }
                return Promise.resolve();
            })
            .then(() => next(), err => next(err));
    },

    assertUserIsAdminAndScientist: (req, res, next) => {
        return getIsAdminAndScientist(req)
            .then(resObj => {
                console.log(resObj);
                if (!resObj.isAdminAndScientist) {
                    return Promise.reject(RS.errorMessage('User does not have access to this action'));
                }
                return Promise.resolve();
            })
            .then(() => next(), err => next(err));
    },

    assertUserIsNotCreator: (req, res, next) => {
        return getIsCreator(req)
            .then(resObj => {
                if (resObj.isCreator) {
                    return Promise.reject(RS.errorMessage('User can not perform this action on her own object'));
                }
                return Promise.resolve();
            })
            .then(() => next(), err => next(err));
    },
    assertUserIsAdmin: (req, res, next) => {
        return getIsAdmin(req)
            .then(resObj => {
                console.log(resObj);
                if (!resObj.isAdmin) {
                    return Promise.reject(RS.errorMessage('User does not have access to this action'));
                }
                return Promise.resolve();
            })
            .then(() => next(), err => next(err));
    }
};
