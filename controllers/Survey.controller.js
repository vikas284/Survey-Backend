'use strict';
const Survey = require('../models/Survey.model');
const SurveyResponse = require('../models/SurveyResponse.model');
const EmailService = require('../services/EmailService');

const create = async (req, res, next) => {
    try {
        let params = req.body;
        let survey = await Survey.create(params);
        return res.status(200).json(survey);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

const find = async (req, res, next) => {
    try {
        let query = {};
        let skip = req.query.skip ? parseInt(req.query.skip) : 0;
        let limit = req.query.limit ? parseInt(req.query.limit) : 1000;
        let surveyCount = await Survey.count(query);
        let survey = await Survey.find(query).sort({ updatedAt: -1 }).skip(skip).limit(limit)
        res.setHeader('x-total-count', surveyCount);
        return res.status(200).json(survey);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

const assigne = async (req, res, next) => {
    try {
        let id = req.params.id;
        let survey = await Survey.findOne({ _id: id });
        let assignedUser = survey.assigne;
        assignedUser.push(req.params.email);
        let updatedSurvey = await Survey.update({ _id: id }, { assigne: assignedUser });
        survey.link = 'http://localhost:4200/survey/' + id + '/' + req.params.email;
        EmailService.register(survey, req.params.email);
        return res.status(200).json(updatedSurvey);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}


const update = async (req, res, next) => {
    try {
        let id = req.params.id;
        let survey = await Survey.update({ _id: id }, req.body);
        return res.status(200).json(survey);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

const findById = async (req, res, next) => {
    try {
        let id = req.params.id;
        let survey = await Survey.findOne({ _id: id });
        return res.status(200).json(survey);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

const deleteSurvey = async (req, res, next) => {
    try {
        let id = req.params.id;
        let survey = await Survey.remove({ _id: id });
        return res.status(200).json(survey);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

const findUserSurvey = async (req, res, next) => {
    try {
        let id = req.params.id;
        let email = req.params.email;
        let survey = await Survey.findOne({ _id: id });
        let sr = await SurveyResponse.findOne({ surveyId: id, email: email });
        let responseData = {
            data: {},
            isAssigned: false,
            isSubmitted: false
        }
        if (survey.assigne.indexOf(email) > -1) {
            responseData.isAssigned = true;
            responseData.data = survey;
        }
        if (sr) {
            responseData.isSubmitted = true;
            responseData.data = {}
        }
        return res.status(200).json(responseData);

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}




module.exports = {
    create,
    find,
    update,
    findById,
    deleteSurvey,
    assigne,
    findUserSurvey
}