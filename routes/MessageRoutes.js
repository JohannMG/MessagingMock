
var express = require('express');
var router = express.Router();
var messagesGenerator = require('../UserMessages.js');
var mockAuthenticator = require('../Modules/AuthChecker.js'); 

var userMessages = {};

//checks auth token, puts customer token into res.customerToken
router.use(mockAuthenticator);

router.get('/', function rootMessages(req, res, next) {
    //var userMessages = userMessages[erq.];
    
    //if no existing messages
    
    //already has messages
    
    
    res.type('json');
    res.status(200).json({messagesRouteOK:'yes'});
    return;
});

//TODO: get message endpoint
router.get('/:messageId', function(req, res, next){ next(); });

//TODO: set message read/unread by id
router.put('/:messageId', function(req, res, next){ next(); });

//TODO: delete message by id
router.delete('/:messageId', function(req, res, next){ next(); });

//send routing 'app' back 
module.exports = router