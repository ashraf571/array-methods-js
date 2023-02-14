'use strict';

const _ = require('lodash');
const bcrypt = require('bcrypt');
const moment = require('moment');
const RS = require('../../base/response/responseService');
const User = require('../../auth/storage/model/User');
const UserStorage = require('../../auth/storage/UserStorage');
const UserValidator = require('../../auth/storage/validation/UserValidator');
const userStorage = new UserStorage({ Model: User, CustomValidator: UserValidator });
const addScientist = (param) => {
    const salt = 10;
    return userStorage.store({
        name: param.name,
        email: param.email,
        password: bcrypt.hashSync(param.password, salt),
        role: 'scientist'
    }, null, userPopulation.find);
};

const updateUser = async (userId, param, user) => {
    try {
        if (param.oldPassword && param.newPassword) {
            const changeUserPassword = await changePassword(userId, param.oldPassword, param.newPassword);
            return changeUserPassword;
        } else if (param.lastLoginTime && param.currentTime) {
            const userData = await userStorage.findOne({ _id: userId });
            const updateLoginTime = await lastActive(param.lastLoginTime, param.currentTime);
            if (updateLoginTime === 1) {
                const updateData = {
                    loggedinAt: param.currentTime,
                    glowBites: userData.glowBites ? userData.glowBites + 2 : 2
                };
                return userStorage.update(userId, updateData, user, userPopulation.find);
            } else {
                return userStorage.update(userId, { loggedinAt: param.currentTime }, user, userPopulation.find);
            }
        }
        const updateData = { ...param };
        return userStorage.update(userId, updateData, user, userPopulation.find);
    } catch (err) {
        return Promise.reject(RS.errorMessage(err.message));
    }
};

const lastActive = (lastLoginTime, currentTime) => {
    const lastDateInFormat = moment(lastLoginTime).format('YYYY-MM-DD');
    const currentDateInFormat = moment(currentTime).format('YYYY-MM-DD');
    const duration = storeService.getFormattedDate(lastDateInFormat, currentDateInFormat);
    const days = duration[0];
    return days;
};

const updateGlowBites = async (value, user) => {
    const getUser = await userStorage.findOne({ _id: user });
    var updateGlowBites = {
        glowBites: getUser.glowBites ? getUser.glowBites + value : value
    };
    return userStorage.update(user, updateGlowBites, user, userPopulation.find);
};

const getAUser = async (userId) => {
    try {
        const user = await userStorage.findOne({ _id: userId });
        console.log("userName", user)
        let newUser = {
            _id: user._id,
            suspend: user.suspend,
            role: user.role,
            glowBucks: user.glowBucks,
            name: user.name,
            userName: user.userName !== undefined ? user.userName.toLowerCase() : '',
            levelNumber: user.levelNumber,
            glowBites: user.glowBites,
            glowPoints: user.glowPoints,
            glowBucks: user.glowBucks,
            isAnonymus: user.isAnonymus,
            facebookId: user.facebookId,
            googleId: user.googleId,
            email: user.email,
            gender: user.gender,
            phoneNumber: user.phoneNumber,
            // lastSpinTime: user.lastSpinTime,
            loggedinAt: user.loggedinAt,
            healthPoints: user.healthPoints,
            underReview: false,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        }
        let teamMembers = await teamStorage.list({ user: userId })
        teamMembers = _.orderBy(teamMembers, ['member', 'blowBucks'], ['desc']);

        let teamMembersProfile = []
        let profile
        if (teamMembers.length > 0) {
            for (var i = 0; i < teamMembers.length; i++) {
                profile = await userStorage.find({ _id: teamMembers[i].member }, {}, userPopulation.find)
                teamMembersProfile.push(profile)
            }
            teamMembersProfile = _.orderBy(teamMembersProfile, ['glowBucks'],['desc'])
        }
        let connectionsList = await connectionStorege.list({ user: userId }, connectionPopulation.list)
        connectionsList = _.orderBy(connectionsList, ['connection', 'blowBucks'], ['desc']);
        console.log("connectionsList", connectionsList)
        const getAnimal = await reviveAnimalStorage.list({ status: { $in: ['live', 'critical', 'die'] }, user: userId }, reviveAnimalePopulation.find, { createdAt: -1 }, 1);
        const getLastAnimal = getAnimal[0];
        if (getLastAnimal) {
            let animalData;
            if (getLastAnimal.status === 'live') {
                animalData = {
                    _id: getLastAnimal.animal._id,
                    name: getLastAnimal.animal.name,
                    animalImage: getLastAnimal.animal.liveAnimalImage,
                    createdAt: getLastAnimal.animal.createdAt,
                    updatedAt: getLastAnimal.animal.updatedAt
                };
            } else if (getLastAnimal.status === 'critical' || getLastAnimal.status === 'die') {
                animalData = {
                    _id: getLastAnimal.animal._id,
                    name: getLastAnimal.animal.name,
                    animalImage: getLastAnimal.animal.criticalAnimalImage,
                    createdAt: getLastAnimal.animal.createdAt,
                    updatedAt: getLastAnimal.animal.updatedAt
                };
            }
            return Promise.resolve({ user: newUser, teamMembers: teamMembersProfile, connections: connectionsList, revivedAnimal: animalData });
        } else {
            return Promise.resolve({ user: newUser, teamMembers: teamMembersProfile, connections: connectionsList });
        }
    } catch (err) {
        return Promise.reject(RS.errorMessage(err.message));
    }
};

const changeUserRole = (userId, role, user) => {
    if (role === 'user' || role === 'scientist' || role === 'admin') {
        const updateData = {
            role: role
        };
        return userStorage.update(userId, updateData, user);
    }
    return Promise.reject(RS.errorMessage('Role is not applicable'));
};

const blockUser = (userId, user) => {
    const updateData = {
        suspend: true
    };
    return userStorage.update(userId, updateData, user);
};

const unblockUser = (userId, user) => {
    const updateData = {
        suspend: false
    };
    return userStorage.update(userId, updateData, user);
};

const softDeleteUser = (user) => {
    const updateData = {
        deleted: true
    };
    return userStorage.update(user._id, updateData, user);
}

const resetUser = async (user) => {
    try {
        await levelStorage.deleteMany({ user: user._id });
        await questionFeedbackStorage.deleteMany({ user: user._id });
        await manageLevelService.addLevel(user);
        return Promise.resolve(RS.successMessage('User reset successfully'));
    } catch (err) {
        return Promise.reject(RS.errorMessage(err.message));
    }
};

const deleteUser = async (userId) => {
    try {
        if (userId !== '5dd500e768ce7c16c4ccdc32') {
            const getQuestions = await questionStorage.list({ author: userId });
            if (getQuestions) {
                const getAnonymusUser = await userStorage.findOne({ _id: '5dd500e768ce7c16c4ccdc32' });
                const idAnonymusUser = getAnonymusUser._id;
                await Question.updateMany({ author: { $eq: userId } }, { $set: { author: idAnonymusUser } });
            }
            await myGoalStorage.deleteMany({ user: userId });
            await questionFeedbackStorage.deleteMany({ user: userId });
            await myLockerStorage.deleteMany({ user: userId });
            await teamStorage.deleteMany({ user: userId });
            await reviveAnimalStorage.deleteMany({ user: userId });
            await teamStorage.deleteMany({ member: userId });
            await connectionStorege.deleteMany({ user: userId });
            await connectionStorege.deleteMany({ connection: userId });
            await levelStorage.deleteMany({ user: userId });
            await userStorage.delete(userId);
            return Promise.resolve(RS.successMessage('User deleted successfully'));
        } else {
            return Promise.resolve(RS.successMessage("You con't delete this user"));
        }
    } catch (err) {
        return Promise.reject(RS.errorMessage(err.message));
    }
};

const changePassword = (userId, oldPassword, newPassword) => {
    return User.findOne({ _id: userId }).populate(userPopulation.find)
        .then(user => {
            if (user && bcrypt.compareSync(oldPassword, user.password)) {
                const updatePassword = { password: bcrypt.hashSync(newPassword, 10) };
                return userStorage.update(userId, updatePassword, user, userPopulation.find);
            } else {
                return Promise.reject(RS.errorMessage('Incorrect old password'));
            }
        });
};

module.exports = {
    addScientist,
    updateUser,
    changeUserRole,
    blockUser,
    unblockUser,
    deleteUser,
    resetUser,
    updateGlowBites,
    getAUser,
    softDeleteUser
};
