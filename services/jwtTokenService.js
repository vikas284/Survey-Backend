const jwt = require("jsonwebtoken");
const config = require('../config');

const issue = (payload) => {
    return jwt.sign(payload, config.jwtTokenSecret, { expiresIn: 24 * 60 * 60 });
}

const verify = (token, callback) => {
    return jwt.verify(token, config.jwtTokenSecret, {}, callback);
}

module.exports = {
    issue,
    verify
}