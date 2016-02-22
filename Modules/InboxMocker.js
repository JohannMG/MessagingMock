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
    'body': <String>
    
}]
*/

var moment = require('moment');
var lipsum = require('lorem-ipsum')

/**
 * details: {
 *  count: number of messages   
 * }
 * 
 */

function Inbox(details){
    this.messages = []
    this.generateAndAppendNew
}

Inbox.prototype.generateAndAppendNewMessages = function generateAndAppendNewMessages (count){
    
};

Inbox.prototype.deleteMessageById = function deleteMessageById(){
    
}

Inbox.prototype.getInboxHeaders = function(){
    
};