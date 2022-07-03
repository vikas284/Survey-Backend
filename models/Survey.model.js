const mongoose = require('mongoose');

const SurveySchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    questions: { type: Array },
    assigne: { type: Array }
}, { timestamps: true });

module.exports = mongoose.model('Survey', SurveySchema);