'use strict';
const SurveyResponse = require('../models/SurveyResponse.model');
const Survey = require('../models/Survey.model');
var ObjectID = require('mongodb').ObjectID;


const create = async (req, res, next) => {
    try {
        let params = req.body;
        let id = new ObjectID(params.surveyId)
        console.log(id);
        let survey = await Survey.findOne({ _id: id });
        let sr = await SurveyResponse.findOne({ surveyId: id, email: params.email });
        params.surveyName = survey.name;
        if (!sr) {
            sr = await SurveyResponse.create(params);
            return res.status(200).json(sr);
        } else {
            return res.status(409).json({ message: 'Survey is already submitted.' });
        }

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

const find = async (req, res, next) => {
    try {
        let query = {};
        let skip = req.query.skip ? parseInt(req.query.skip) : 0;
        let limit = req.query.limit ? parseInt(req.query.limit) : 1000;
        let srCount = await SurveyResponse.count(query);
        let sr = await SurveyResponse.find(query).sort({ updatedAt: -1 }).skip(skip).limit(limit)
        res.setHeader('x-total-count', srCount);
        return res.status(200).json(sr);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

module.exports = {
    create,
    find
}