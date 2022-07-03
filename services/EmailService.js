"use strict";
const fs = require("fs");
const path = require('path')
const ejs = require("ejs");
const Nodemailer = require("nodemailer");
const config = require('../config');

const transporter = Nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: 'sachin8garg2000@gmail.com',
        pass: 'Sachin987654321'
    }
});

const register = async (survey,email) => {
    const ejsPath = path.join(__dirname, '../views/survey_register.ejs');
    const data = await ejs.renderFile(ejsPath, { survey: survey });
    const mainOptions = {
        to: email,
        subject: `Survey Registeration`,
        html: data
    };
    transporter.sendMail(mainOptions, (err, info) => {
        console.log(err);
        if (!err) {
            return info.res
        }
    });

}



module.exports = {
    register
}