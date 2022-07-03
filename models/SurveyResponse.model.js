const mongoose = require('mongoose');

const SurveyResponseSchema = new mongoose.Schema({
    surveyId: { type: String },
    surveyName: { type: String },
    email: { type: String },
    questions: { type: Array },
}, { timestamps: true });

module.exports = mongoose.model('SurveyResponse', SurveyResponseSchema);