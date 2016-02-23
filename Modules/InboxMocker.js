/** 
 * Mocks a user's inbox. Pass a number to createBatch(<number>) to get new "Emails" for a user
 * Helper methods to manipulate
array of objects: [{
 --header part   
    'id': <number>, 
    'read': <boolean>,
    'sent: <String:datetime> "2016-01-12T14:15:00",
    'title': <String>,
    'subject': <String>,
 --Total
    'contentType': "TEXT" || "HTML",
--NOT INCLUDED 
    'body': <String>
    must be genrated externally on the fly. reduces memory useage 
    
}]
*/

var moment = require('moment');
var lipsum = require('lorem-ipsum');

/**
 * details: {
 *  count: number of messages   
 * }
 * 
 */

function Inbox(details){
    details = details || {count: 23};
    
    //get messages, will be sorted automatically
    this.messages = this.generateNewMessages( details.count ) ;
}

/**
 * Generates new COUNT messages and returns an array
 * param count: number of messages to generate
 */
Inbox.prototype.generateNewMessages = function generateNewMessages (count){
    
    var timestamp = moment.now();      
    var newMessages = [];
    
    for (var index = 0; index < count; index++) { 
        
        //offset each next message by 0-100 hours 
        var hoursdiff = Math.round(Math.random() * 100);
        timestamp = moment(timestamp).subtract(hoursdiff, 'hours');
        
        //create new email object
        var newEmail = {};
        newEmail.id  = Math.round(Math.random() * 1000000000000000);  
        newEmail.read = false;  
        newEmail.sent = moment(timestamp).toJSON();  
        newEmail.title = lipsum({ 
            count: Math.round(Math.random() * 5),
            units: 'words', 
            format: 'plain',             
        });   
        newEmail.subject = lipsum({ 
            count: Math.round(Math.random() * 8),
            units: 'words', 
            format: 'plain',             
        });  
        
        //auto mark less than 1 of 5 as plaintext
        newEmail.contentType = Math.round(Math.random() * 5) % 5 === 0 ? 'TEXT' : 'HTML';   
        
        newMessages.push(newEmail);         
    }
    
    return newMessages;
};

Inbox.prototype.getMessageById = function getMessageById(id) {
    return this.messages.find(function (element) {
        return element.id == id;
    });
}

//Find and delete message by id sent
/**
 * Find and deletes message by ID sent
 * param deletionTarget: id of message to find and delete
 * param callback: fn(err, success)
 *      success is true is message to delete was found 
 */
Inbox.prototype.deleteMessageById = function deleteMessageById( deletionTargetId, callback ){

    var found = this.messages.reduce(function (reduceVal, element, idx) {
        return ( reduceVal || (element.id == deletionTargetId) ) 
    },false);
    
    callback(null, found);
    //continue with request, async data manips 
    
    this.messages = this.messages.filter(function (element, index){
        return element.id != deletionTargetId;
    }); 
    
};

//return array of objects made of only header info 
Inbox.prototype.getInboxHeaders = function getInboxHeaders () {
    
    return this.messages.map(function getHeaderParams(element) {
        return {
            id: element.id,
            read: element.read,
            sent: element.sent,
            title: element.title,
            subject: element.subject 
        };
    });
};

/**
 * Find message by ID, and change that value
 * param messageId: integer for message id
 * param readBoolean: boolean to set 
 * param callback: fn(err, didUpdate)
 *      did update will be true if item found AND deleted 
 */
Inbox.prototype.updateReadStatus = function updateMessage(messageId, readBoolean, callback) {
    
    var foundMessage = this.messages.find(function(element){
        return element.id == messageId;
    });
    
    if (foundMessage !== undefined){
        foundMessage.read = readBoolean;
        callback(null, true);
        
    } else {
        callback(null, false);
    }
};

Inbox.prototype.getTotalMessages = function getTotalMessages() {
    return this.messages.length;
};

Inbox.prototype.getUnreadMessageCount = function getUnreadMessageCount(){
    return this.messages.filter(function (element, index) {
        return !element.read;
    }).length;
};

/**
 * Return [messages] within range defined in offet and limit
 * param offset: The first message (counting from 1, 2 returns the second message or [1])
 * param limit: Number of messages to return 
 * param callback: function that returns (err, returnArray)
 */
Inbox.prototype.getMessagesWithOffsetLimit = function getMessageWithOffsetLimit(offset, limit, callback) {
    var pluckedMessages = []; 
    
    for (var index = offset-1, count = 1; index < this.messages.length && count <= limit; index++) {
        count++;
        pluckedMessages.push(this.messages[index]); 
    }
    
    if (callback != undefined){
        callback(null, pluckedMessages);
    }
    
    return pluckedMessages;
}



module.exports = Inbox;