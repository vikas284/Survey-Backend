const crypto = require("crypto");
const config = require('../config');
const User = require('../models/User.model');
const jwtTokenService = require('../services/jwtTokenService');
const logger = require('./log');


const verifyjwtToken = async(req, res, next) => {
    let token;
    if (req.headers && req.headers.authorization) {
        token = req.headers.authorization
    } else if (req.query && req.query.authorization) {
        token = req.query.authorization
    }
    jwtTokenService.verify(token, function(err, token) {
        if (err) {
            return res.status(401).json({ message: err.message });
        }
        User.findOne({ email: token.email }).then((user) => {
            if (user) {
                next();
            } else {
                return res.status(403).json({ message: 'Unauthorised access while performing the action' });
            }
        });

    })
}

module.exports = {
    verifyjwtToken
}