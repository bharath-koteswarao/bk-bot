/**
 * Created by koteswarao on 15-07-2017.
 */
var express = require('express');
var router = express.Router();

/* GET home page. */
router.post('/', function(req, res, next) {
    res.send(req.body.name+" "+"is response");
});

module.exports = router;
