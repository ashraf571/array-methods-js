'use strict';

const bcrypt = require('bcrypt');
const _ = require('lodash');
const jwt = require('jsonwebtoken');
const moment = require('moment');
const RS = require('../../base/response/responseService');
const User = require('../storage/model/User');
const UserStorage = require('../storage/UserStorage');
const UserValidator = require('../storage/validation/UserValidator');
const userStorage = new UserStorage({ Model: User, CustomValidator: UserValidator });
const userPopulation = require('../storage/populate/userPopulation');

const adminLogin = (param) => {
    try {
        var email = param.email.toLowerCase();
        return userStorage.findOne({ email: email, role: { $in: ['admin', 'scientist'] } }, userPopulation.find)
            .then(user => {
                if (user && bcrypt.compareSync(param.password, user.password)) {
                    const token = authToken(user);
                    return Promise.resolve({ token: token, user: user });
                } else {
                    return Promise.reject(RS.errorMessage('Authentication Failed'));
                }
            });
    } catch (err) {
        return Promise.reject(RS.errorMessage(err.message));
    }
};

const anonymousSignup = () => {
    try {
        return userStorage.store({
            name: '',
            userName: '',
            loggedinAt: moment.utc().format(),
            healthPoints: 0,
        }, null, userPopulation.find)
            .then(async user => {
                let getAndi
                const levels = await manageLevelService.addLevel(user);
                const token = authToken(user);
                let newUser = {
                    _id: user._id,
                    suspend: user.suspend,
                    role: user.role,
                    glowBucks: user.glowBucks,
                    name: user.name,
                    loggedinAt: user.loggedinAt,
                    healthPoints: user.healthPoints,
                    underReview: false,
                    createdAt: user.createdAt,
                    updatedAt: user.updatedAt
                }
                getAndi = await userStorage.findOne({ email: "instructorandi@giik.org" }, userPopulation.find)
                if (getAndi) {
                    await teamService.addTeamMember(getAndi._id, user._id)
                    await connectionService.addConnection(getAndi._id, user._id)
                } else {
                    getAndi = await userStorage.store({
                        name: "Instructor Andi",
                        email: "instructorandi@giik.org",
                        glowBucks: 45,
                        glowBites: 45,
                        glowPoints: 45,
                        loggedinAt: moment.utc().format(),
                        glowBites: 8,
                        password: bcrypt.hashSync("12345678", 10),
                        role: "instructor",
                    })
                    await teamService.addNewTeamMember(getAndi._id, user._id)
                }
                return Promise.resolve({ token: token, user: newUser, level: levels });
            });
    } catch (err) {
        return Promise.reject(RS.errorMessage(err.message));
    }
};

const userSignup = (param) => {
    try {
        const salt = 10;
        return userStorage.store({
            name: param.name,
            email: param.email,
            password: bcrypt.hashSync(param.password, salt),
            phoneNumber: param.phoneNumber,
            gender: param.gender,
            role: param.role,
            glowPoints: 1,
            loggedinAt: moment.utc().format(),
            glowBites: 8
        }, null, userPopulation.find)
            .then(async user => {
                await manageLevelService.addLevel(user);
                const token = authToken({}, user);
                return Promise.resolve({ token: token, user });
            });
    } catch (err) {
        return Promise.reject(RS.errorMessage(err.message));
    }
};

const userLogin = (param) => {
    try {
        var email = param.email.toLowerCase();
        return userStorage.findOne({ email: email }, userPopulation.find)
            .then(async user => {
                if (user && bcrypt.compareSync(param.password, user.password) && !user.suspend) {
                    const token = authToken(user);
                    const updateData = {
                        loggedinAt: moment.utc().format(),
                        glowBites: user.glowBites ? user.glowBites + 2 : 2
                    };
                    await glowBites(user.loggedinAt, updateData, user);
                    return Promise.resolve({ token: token, user: user });
                } else {
                    return Promise.reject(RS.errorMessage('Authentication Failed'));
                }
            });
    } catch (err) {
        return Promise.reject(RS.errorMessage(err.message));
    }
};



const socialSignin = async (param, socialType) => {
    console.log("param", param)
    try {
        var username = param.name.split(' ')
        if (username[0] && username[1]) {
            const user = await User.findOne({ userName: username[0] + '.' + username[1] });
            if (user) {
                username = username[0] + '.' + username[1] + Math.floor(Math.random() * 10) + Math.floor(Math.random() * 10) + Math.floor(Math.random() * 10)
            }
            if (!user) {
                username = username[0] + '.' + username[1];
            }
        }
        else {
            const user = await User.findOne({ userName: username[0] });
            if (user) {
                username = username[0] + Math.floor(Math.random() * 10) + Math.floor(Math.random() * 10) + Math.floor(Math.random() * 10)
            }
            if (!user) {
                username = username[0];
            }
        }
        let query = {};
        const userId = { _id: param.userId };
        if (socialType === 'facebook') {
            query = { $and: [{ facebookId: param.facebookId }, { facebookId: { $exists: true } }] };
        }
        if (socialType === 'instagram') {
            query = { $and: [{ instagramId: param.instagramId }, { instagramId: { $exists: true } }] };
        }
        if (socialType === 'google') {
            query = { $and: [{ googleId: param.googleId }, { googleId: { $exists: true } }] };
        }
        const user = await userStorage.findOne(query, userPopulation.find);
        console.log("user", user)

        if (user) {
            if (!user.suspend) {
                if (!user.deleted) {
                    const updateData = {
                        ...param,
                        userName: username !== "" ? username.toLowerCase() : username,
                        loggedinAt: moment.utc().format(),
                        glowBites: user.glowBites ? user.glowBites + 2 : 2
                    };
                    const updatedUser = await glowBites(user.loggedinAt, updateData, user);
                    const token = authToken(updatedUser);
                    return Promise.resolve({ token: token, user: updatedUser });
                } else {
                    return Promise.reject(RS.errorMessage('Your account has been deactivated. Please contact our support team.'));
                }
            } else {
                return Promise.reject(RS.errorMessage('Your account is blocked. Please contact our support team'));
            }
        }
        const getUser = await userStorage.findOne(userId, userPopulation.find);
        console.log("getUser", getUser)
        if (getUser) {
            if (!getUser.suspend) {
                if (!getUser.deleted) {
                    const updateData = {
                        ...param,
                        userName: username !== "" ? username.toLowerCase() : username,
                        loggedinAt: moment.utc().format(),
                        glowBites: getUser.glowBites ? getUser.glowBites + 2 : 2,
                        isAnonymous: false

                    };
                    const updatedUser = await userStorage.update(getUser._id, updateData, getUser, userPopulation.find);
                    const token = authToken(updatedUser);
                    return Promise.resolve({ token: token, user: updatedUser });
                }
                else {
                    return Promise.reject(RS.errorMessage('your account has been deactivated, please contact our support'));
                }
            } else {
                return Promise.reject(RS.errorMessage('Your account is block, please contact our support'));
            }
        }
    } catch (error) {
        return Promise.reject(RS.errorMessage(error.message));
    }
};

const glowBites = async (logedAt, updateData, user) => {
    try {
        const FinalResult = await storeService.dateDifference(logedAt);
        if (FinalResult === 1) {
            return userStorage.update(user._id, updateData, user, userPopulation.find);
        } else {
            return userStorage.update(user._id, { loggedinAt: moment.utc().format() }, user, userPopulation.find);
        }
    } catch (err) {
        return Promise.reject(RS.errorMessage(err.message));
    }
};

const authToken = (user) => {
    return jwt.sign(
        {
            email: user.email,
            _id: user._id,
            role: user.role
        },
        process.env.SECRET_KEY,
        {
            expiresIn: process.env.TOKEN_EXPIRY_TIME
        }
    );
};

module.exports = {
    adminLogin,
    userSignup,
    userLogin,
    socialSignin,
    authToken,
    glowBites,
    anonymousSignup
};
