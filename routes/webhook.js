/**
 * Created by koteswarao on 15-07-2017.
 */
var express = require('express');
var router = express.Router();
var config = require(__dirname + "/../public/config");
var request = require("request");
var container = {};


var slots = {
    getSlotInfo: function (slot) {
        return this[slot];
    },
    "A1": {
        "subject": "ECE 4001",
        "name": "DIGITAL COMMUNICATION SYSTEMS",
        "venue": "TT631",
        "slot": "A1",
        "faculty": "VELMURUGAN T"
    },
    "B1": {
        "subject": "ECE 2002",
        "name": "ANALOG ELECTRONIC CIRCUITS",
        "venue": "TT504",
        "slot": "B1",
        "faculty": "JASMIN"
    },
    "B2": {
        "subject": "ECE 3004",
        "name": "Computer Organization and Architectures",
        "venue": "TT715",
        "slot": "B2+TB2",
        "faculty": "ASHISH P"
    },
    "C1": {
        "subject": "ECE 2006",
        "name": "DIGITAL SIGNAL PROCESSING",
        "venue": "TT621",
        "slot": "C1",
        "faculty": "VALARMATHI"
    },
    "C2": {
        "subject": "ECE 2005",
        "name": "PROBABILITY",
        "venue": "TT715",
        "slot": "C2+TC2",
        "faculty": "SANKAR GANESH S"
    },
    "D1": {
        "subject": "ECE 3003",
        "name": "MICRO CONTROLLER AND ITS APPLICATIONS",
        "venue": "TT630",
        "slot": "D1",
        "faculty": "GERARDINE IMMACULATE MARY"
    },
    "E1": {
        "subject": "ECE 3010",
        "name": "ANTENNAS AND WAVE PROPAGATION",
        "venue": "TT208",
        "slot": "E1+TE1",
        "faculty": "RAJESHKUMAR V"
    },
    "E2": {
        "subject": "ECE 2008",
        "name": "ROBOTICS AND AUTOMATION",
        "venue": "SJT124",
        "slot": "E2",
        "faculty": "VENUGOPAL P"
    },
    "F1": {
        "subject": "STS 3001",
        "name": "SOFT SKILLS",
        "venue": "TT716",
        "slot": "F1+TF1",
        "faculty": ""
    },
    "L57+L58": {
        "subject": "DSP lab",
        "name": "",
        "venue": "TT232",
        "slot": "L57+L58",
        "faculty": "VALARMATHI"
    },
    "L31+L32": {
        "subject": "Micro-controller lab",
        "name": "",
        "venue": "TT729",
        "slot": "L31+L32",
        "faculty": "GERARDINE IMMACULATE MARY"
    },
    "L29+L30": {
        "subject": "DCS lab",
        "name": "",
        "venue": "TT135",
        "slot": "L29+L30",
        "faculty": "VELMURUGAN T"
    }
};

var getSlot = function (date) {
    var day = date.getDay();
    this.hours = date.getHours();
    this.minutes = date.getMinutes();
    var parent = this;
    this.get_slot_of_monday = function (hours, minutes) {
        if (hours === 8 && minutes <= 50) {
            return "A1";
        } else if (hours === 9 && minutes <= 50) {
            return "F1";
        } else if (hours === 10 && minutes <= 50) {
            return "D1";
        } else if (hours === 17 && minutes <= 50) {
            return "B2";
        } else if ((hours >= 14 && hours <= 15) && (minutes >= 0 && minutes <= 40)) {
            return "L31+L32";
        } else {
            return config.free_slot_name;
        }
    };
    switch (day) {
        case 0: {
            return "Today is a holiday !!";
        }
        case 1: {
            return {
                "current_slot": parent.get_slot_of_monday(parent.hours, parent.minutes),
                "class_count": 4,
                "lab_count": 1,
                "total": 5
            };
        }
        case 2: {
            break;
        }
        case 3: {
            break;
        }
        case 4: {
            break;
        }
        case 5: {
            break;
        }
        case 6: {
            return "Today is a holiday !!";
        }
    }
};

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
                userMessage = messageObject.message.text;
                recipientId = messageObject.sender.id;
            });
        });
        var reply = replyMessage(userMessage);
        sendReply(recipientId, reply);
    }
}

function replyMessage(userMessage) {
    return "You typed "+userMessage;
    //var tokens = userMessage.split(" ");
    // if (userMessage==="show") {
    //     var date = new Date();
    //     var currentSlot = getSlot(date);
    //     var slotInfo=slots.getSlotInfo(currentSlot);
    //     return slotInfo.subject+"\n"+slotInfo.venue+"\n"+slotInfo.slot+"\n"+slotInfo.faculty;
    // } else {
    //     return "Hello !!\nYou can ask me these \n 1) Show my time table \n2) What is the current slot running now \n3)How many periods do I have now\n 4)" +
    //         "";
    // }
}

function sendReply(recipientId, replyMessage) {
    var messageData = {
        recipient: {
            id: recipientId
        },
        message: {
            text: replyMessage
        }
    };
    callSendReplyApi(messageData);
}

function callSendReplyApi(messageData) {
    request({
        uri: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token: config.access_token},
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
