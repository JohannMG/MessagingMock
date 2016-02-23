
var express = require('express');
var router = express.Router();
var handlebars = require('handlebars');
var fs = require('fs');

var messagesGenerator = require('../UserMessages.js');
var mockAuthenticator = require('../Modules/AuthChecker.js'); 
var Inbox = require('../Modules/InboxMocker.js');

//dictionary to hold all live user mock 'inboxs' [usertoken:inbox]
var userMessages = {};

//checks auth token, puts customer token into req.customerToken
router.use(mockAuthenticator);

/**
 * Route for GET messages
 */
router.get('/', function rootMessages(req, res, next) {
    var userInbox;
    
    //Check that offset and limit are provided and Integers
    if ( req.query.offset === undefined || req.query.limit === undefined ||
            isNaN(parseInt(req.query.offset)) || isNaN((req.query.limit))  ){
        console.log("Error: OFFSET and LIMIT must be provided as integers");
        res.status(400).json({error: 'Offset and limit must be provided as intergers'});
        return;
    }
    
    //Documentation starts index/offset at 1 for first message
    if (req.query.offset < 1){
        console.log('Error: offset must be greater or equal to 1');
        res.status(400).json({error:'Offset must be greater than or equal to 1'});
        return;
    }
    
    //Check if existing inbox
    if (userMessages[req.customerToken] != undefined){
        userInbox = userMessages[req.customerToken];
    } else{
        //make new inbox otherwise
        userInbox = new Inbox();
        userMessages[req.customerToken] = userInbox;
    }
    
    //set headers
    res.set({
        'X-Messages-Total': userInbox.getTotalMessages(),
        'X-Messages-Unread': userInbox.getUnreadMessageCount(),
        'X-Message-Offset': req.query.offset,
        'X-Message-Limit': req.query.limit
    });
    
    res.type('json');
    res.status(200).json( userInbox.getMessagesWithOffsetLimit( req.query.offset, req.query.limit ) );
    return;
});

/**
 * Get message for UserToken, must have called / first to initiate mailbox
 */
router.get('/:messageId', function(req, res, next){
    var userInbox = userMessages[req.customerToken];
    if (userInbox === undefined){
        res.status(400).json({error: 'User does not have a mailbox. Call / first'});
        return;
    }
    
    //Have to compile the sample content here with Handlebars
    var message = userInbox.getMessageById(req.params.messageId)
    if (message === undefined){
        res.status(404).json({error:'Message not found for user. Make sure to use / endpoint first and that id is valid'});
        return;
    } 
    renderedTemplate(message.contentType, message.subject, function (err, bodyContent) {
        if (err){
            console.log(err);
            res.status(500).json({error: 'internal error retriving email template'});
            return;
        }
        
        message.body = bodyContent ;
        res.status(200).json(message);
        
        //delete rendered body, we'll just re-render it if needed later rather than bloat memory
        delete message.body;
    })
    
});

function renderedTemplate(textMode, subject, callback) {
     
     var templatePath = textMode.toUpperCase() === 'HTML' ? './templates/htmlMessage.handlebars' : './templates/plainMessage.handlebars'; 
     
     fs.readFile(templatePath, 'utf-8', function (err, filetext) {
         if (err){
             callback(err);
             return;
         }
         
         var compiledSource = handlebars.compile(filetext);
         var body = compiledSource({subject});
         callback(null, body);
     })
     
};

//TODO: set message read/unread by id
router.put('/:messageId', function(req, res, next){

    //Check message ID is an integer
    if (req.params.messageId === undefined || isNaN(parseInt(req.params.messageId))){
        res.status(400).json({error:'Must supply id as an integer'});
        return;
    }
    //Check user exists
    var inbox = userMessages[req.customerToken];
    if (inbox === undefined){
        res.status(404).json({error:'User not found, make sure to user / first to create inbox'});
        return;
    }
    //Check that "read" was sent in body, and is a Bool
    if (req.body.read === undefined || typeof req.body.read != 'boolean' ){
        res.status(400).json({error: 'read parameter must be provided in body as boolean'});
    }
   
   //Update and return 204 if operation was successful
    inbox.updateReadStatus(req.params.messageId, req.body.read, function (err, successful ) {
        if (successful){
            res.set({
                'X-Messages-Total': inbox.getTotalMessages(),
                'X-Messages-Unread': inbox.getUnreadMessageCount()
            });
            res.status(204).send();
            
        } else {
            res.status(404).json({error: 'Message was not found to update'});
        }
    });

});

//TODO: delete message by id
router.delete('/:messageId', function(req, res, next){
    
    //Check message ID is an integer
    if (req.params.messageId === undefined || isNaN(parseInt(req.params.messageId))){
        res.status(400).json({error:'Must supply id as an integer'});
        return;
    }
    
    //Check user exists
    var inbox = userMessages[req.customerToken];
    if (inbox === undefined){
        res.status(404).json({error:'User not found, make sure to user / first to create inbox'});
        return;
    }
    
    inbox.deleteMessageById( req.params.messageId, function(err, successful){
        if (successful){
            res.set({
                'X-Messages-Total': inbox.getTotalMessages(),
                'X-Messages-Unread': inbox.getUnreadMessageCount()
            });
            res.status(204).send();
        } else{
            res.status(404).json({error:'Message to delete was not found'});
        }
    });
    
    
});

//send routing 'app' back 
module.exports = router