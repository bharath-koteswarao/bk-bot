/**
 * Created by koteswarao on 15-07-2017.
 */
var express = require('express');
var router = express.Router();
var config = require(__dirname + "/../public/config");
var request= require("request");

/* GET home page. */
router.get('/', function (req, res, next) {
    if (req.query['hub.mode'] === 'subscribe' &&
        req.query['hub.verify_token'] === config.verify_token) {
        res.status(200).send(req.query['hub.challenge']);
    } else {
        console.error("Failed validation. Make sure the validation tokens match.");
        res.sendStatus(403);
    }
});


router.post('/', function (req, res) {
    parseMessages(req);
    res.sendStatus(200);
});

function parseMessages(req) {
    var userMessage;
    var recipientId;
    var data = req.body;
    if (data.object === 'page') {
        data['entry'].forEach(function (entry) {
            entry['messaging'].forEach(function (messageObject) {
                userMessage= messageObject.message.text;
                recipientId=messageObject.sender.id;
            });
        });
        var replyMessage="Hello how are you !!";
        sendReply(recipientId,replyMessage);
    }
}

function replyMessage(userMessage) {
    return "hii how are you !!";
}

function sendReply(recipientId, replyMessage) {
    var messageData={
        recipient:{
            id:recipientId
        },
        message:{
            text:replyMessage
        }
    };
    callSendReplyApi(messageData);
}

function callSendReplyApi(messageData) {
    request({
        uri: 'https://graph.facebook.com/v2.6/me/messages',
        qs: { access_token: config.access_token },
        method: 'POST',
        json: messageData
    }, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            console.log(body);
        } else {
            console.log("Error occured");
            console.log(response);
        }
    });
}
module.exports = router;
