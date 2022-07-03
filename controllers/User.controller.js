'use strict';
const User = require('../models/User.model');
const logger = require('../middlewares/log');
const EmailService = require('../services/EmailService');
const jwtTokenService = require('../services/jwtTokenService');
const bcrypt = require('bcrypt');

const register = async(req, res, next) => {
    try {
        let isUserExists = false;
        let params = req.body;
        let mailData = Object.assign({}, params);
        bcrypt.genSalt(10, function(err, salt) {
            bcrypt.hash(params.password, salt, function(err, hash) {
                params.email = params.email.toLowerCase().trim();
                params.password = hash;
                return User.find({ email: params.email }).then((user) => {
                    return user.length ? isUserExists = true : User.create(params);
                }).then((userData) => {
                    if (isUserExists) {
                        return res.status(403).json({ message: 'User already Exist' });
                    } else {
                        return res.status(200).json(userData);
                    }
                }).catch((err) => {
                    return res.status(500).json({ message: err.message });
                })
            });
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

const find = async(req, res, next) => {
    logger.info('User controller find ');
    try {
        let query = {};
        let skip = req.query.skip ? parseInt(req.query.skip) : 0;
        let limit = req.query.limit ? parseInt(req.query.limit) : 1000;
        let userCount = await User.count(query);
        let users = await User.find(query).sort({ updatedAt: -1 }).skip(skip).limit(limit)
        res.setHeader('x-total-count', userCount);
        return res.status(200).json(users);
    } catch (error) {
        logger.error(`Error During User controller Find | ${err.message}`);
        return res.status(500).json({ message: error.message });
    }
}

const login = async(req, res, next) => {
    try {
        let params = req.body;
        params.email = params.email.toLowerCase().trim();
        var user = await User.findOne({ email: params.email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid Email or Password' });
        }
        bcrypt.compare(params.password, user.password, function(err, result) {
            if (err) {
                return res.status(500).json({ message: err.message });
            }
            if (result) {
                let userData = {
                    name: user.name,
                    email: user.email,
                    token: jwtTokenService.issue({ email: user.email })
                }
                return res.status(200).json(userData);
            } else {
                return res.status(401).json({ message: 'Invalid Email or Password' });
            }
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

const deleteUser = async(req, res, next) => {
    logger.info('User controller Delete : ' + req.params.id);
    try {
        let user = await User.deleteOne({ _id: req.params.id });
        return res.status(200).json(user);
    } catch (error) {
        logger.error(`Error During User controller Delete | ${err.message}`);
        return res.status(500).json({ message: error.message });
    }
}

module.exports = {
    register,
    login,
    find,
    deleteUser
}