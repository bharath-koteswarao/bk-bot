/**
 * Created by koteswarao on 15-07-2017.
 */
var express = require('express');
var router = express.Router();
var config=require("config");

/* GET home page. */
router.get('/', function(req, res, next) {
    if (req.query['hub.mode'] === 'subscribe' &&
        req.query['hub.verify_token'] === config.verify_token) {
        res.status(200).send(req.query['hub.challenge']);
    } else {
        console.error("Failed validation. Make sure the validation tokens match.");
        res.sendStatus(403);
    }
});

module.exports = router;
