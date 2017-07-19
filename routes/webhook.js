/**
 * Created by koteswarao on 15-07-2017.
 */
var express = require('express');
var router = express.Router();
var config = require(__dirname + "/../public/config");
var request = require("request");
var indianTime = require(__dirname + "/../get-indian-time");


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

var slotsOnToday = {
    "monday": ['A1', 'F1', 'D1', 'B2', 'L31+L32'],
    "tuesday": ['B1', 'E1', 'B2', 'E2', 'C2'],
    "wednesday": ['C1', 'A1', 'F1', 'C2'],
    "thursday": ['D1', 'B1', 'E1', 'B2'],
    "friday": ['E1', 'C1', 'F1', 'E2', 'C2', 'L29+L30', 'L57+L58'],
    getAllSlots: function (day) {
        return this[day];
    }
};

var getSlot = function (indian_time) {
    var day = indian_time.getDay();
    this.hours = indian_time.getHours();
    this.minutes = indian_time.getMinutes();
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
    this.get_slot_of_tuesday = function (hours, minutes) {
        if (hours === 8 && minutes <= 50) {
            return "B1";
        } else if (hours === 10 && minutes <= 50) {
            return "E1";
        } else if (hours === 14 && minutes <= 50) {
            return "B2";
        } else if (hours === 16 && minutes <= 50) {
            return "E2";
        } else if (hours === 17 && minutes <= 50) {
            return "C2";
        } else {
            return config.free_slot_name;
        }
    };
    this.get_slot_of_wednesday = function (hours, minutes) {
        if (hours === 8 && minutes <= 50) return "C1";
        else if (hours === 9 && minutes <= 50) return "A1";
        else if (hours === 10 && minutes <= 50) return "F1";
        else if (hours === 14 && minutes <= 50) return "C2";
        else return config.free_slot_name;
    };
    this.get_slot_of_thursday = function (hours, minutes) {
        if (hours === 8 && minutes <= 50) return "D1";
        else if (hours === 9 && minutes <= 50) return "B1";
        else if (hours === 11 && minutes <= 50) return "E1";
        else if (hours === 15 && minutes <= 50) return "B2";
        else return config.free_slot_name;
    };
    this.get_slot_of_friday = function (hours, minutes) {
        if (hours === 8 && minutes <= 50) return "E1";
        else if (hours === 9 && minutes <= 50) return "C1";
        else if (hours === 11 && minutes <= 50) return "F1";
        else if (hours === 12 && hours <= 14) return "L29+L30";
        else if (hours === 14 && minutes <= 50) return "E2";
        else if (hours === 15 && minutes <= 50) return "C2";
        else if (hours === 16 && hours <= 18) return "L57+L58";
        else return config.free_slot_name;
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
            return {
                "current_slot": parent.get_slot_of_tuesday(parent.hours, parent.minutes),
                "class_count": 5,
                "lab_count": 0,
                "total": 5
            };
        }
        case 3: {
            return {
                "current_slot": parent.get_slot_of_wednesday(parent.hours, parent.minutes),
                "class_count": 4,
                "lab_count": 0,
                "total": 4
            };
        }
        case 4: {
            return {
                "current_slot": parent.get_slot_of_thursday(parent.hours, parent.minutes),
                "class_count": 4,
                "lab_count": 0,
                "total": 4
            };
        }
        case 5: {
            return {
                "current_slot": parent.get_slot_of_friday(parent.hours, parent.minutes),
                "class_count": 5,
                "lab_count": 2,
                "total": 7
            };
        }
        default: {
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

function testHaiInMsg(msg) {
    if (msg.indexOf("hii") >= 0 || msg.indexOf("hi") >= 0 ||
        msg.indexOf("hai") >= 0 || msg.indexOf("haai") >= 0 || msg.indexOf("haaai") >= 0 ||
        msg.indexOf("haiii") >= 0) {
        return true;
    }
}
function replyMessage(userMessage) {
    userMessage = userMessage.toLowerCase();
    var tokens = userMessage.split(" ");
    var builder = "";
    if (testHaiInMsg(userMessage)) {
        builder += "Hello how are you !!\n";
        return builder;
    }
    if (tokens.indexOf("slot") >= 0) {
        if (tokens.indexOf("current") >= 0
            || tokens.indexOf("running") >= 0
            || tokens.indexOf("now") >= 0
            || tokens.indexOf("show") >= 0) {
            builder += JSON.stringify(getSlot(indianTime));
            return builder;
        }
        else if (tokens.indexOf("next") >= 0) {
            builder += "Functionality coming soon...";
            return builder;
        }
    }
    if (tokens.indexOf("time table") || tokens.indexOf("on")) {
        if (tokens.indexOf("monday") >= 0) {
            slotsOnToday.getAllSlots("monday").forEach(function (slot) {
                builder += slot + "\n";
            });
            return builder;
        } else if (tokens.indexOf("tuesday") >= 0) {
            slotsOnToday.getAllSlots("tuesday").forEach(function (slot) {
                builder += slot + "\n";
            });
            return builder;
        } else if (tokens.indexOf("wednesday") >= 0) {
            slotsOnToday.getAllSlots("wednesday").forEach(function (slot) {
                builder += slot + "\n";
            });
            return builder;
        } else if (tokens.indexOf("thursday") >= 0) {
            slotsOnToday.getAllSlots("thursday").forEach(function (slot) {
                builder += slot + "\n";
            });
            return builder;
        } else if (tokens.indexOf("friday") >= 0) {
            slotsOnToday.getAllSlots("friday").forEach(function (slot) {
                builder += slot + "\n";
            });
            return builder;
        } else if (tokens.indexOf("saturday") >= 0 || (tokens.indexOf("sunday") >= 0)) {
            return "No slots today";
        } else {
            return "Time table on what day ?";
        }
    } else {
        builder += JSON.stringify(getSlot(indianTime));
        return builder;
    }


    // todo commands for hi and hello things
    // todo should show the current slot running now
    // todo should show the next class and venue
    // todo should show next break
    // todo should show all classes on a specified day
    // todo should show number of classes today
    // todo should have some fun with in it
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
