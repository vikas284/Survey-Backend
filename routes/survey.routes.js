const express = require('express');
const router = express.Router();
const Auth = require('../middlewares/auth');
const User = require('../controllers/User.controller');
const Survey = require('../controllers/Survey.controller');
const SurveyResponse = require('../controllers/SurveyResponse.controller');


//User Route
router.post('/user', User.register);
router.post('/user/login', User.login);
router.get('/user', Auth.verifyjwtToken, User.find);
router.delete('/user/:id', Auth.verifyjwtToken, User.deleteUser);


//SurveyResponse Route
router.post('/survey/response', SurveyResponse.create);
router.get('/survey/response', SurveyResponse.find);


router.post('/survey', Auth.verifyjwtToken, Survey.create);
router.get('/survey', Auth.verifyjwtToken, Survey.find);
router.get('/survey/:id', Auth.verifyjwtToken, Survey.findById);
router.get('/survey/:id/:email', Survey.findUserSurvey);
router.delete('/survey/:id', Auth.verifyjwtToken, Survey.deleteSurvey);
router.put('/survey/:id', Auth.verifyjwtToken, Survey.update);
router.put('/survey/assign/:id/:email', Auth.verifyjwtToken, Survey.assigne);



module.exports = router;