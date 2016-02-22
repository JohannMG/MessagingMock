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
    this.messages = this.generateNewMessages( details.count ) ;
}

Inbox.prototype.generateNewMessages = function generateNewMessages (count){
    
    var timestamp = moment();      
    var newMessages = [];
    for (var index = 0; index < count; index++) { 
        
        var hoursdiff = Math.round(Math.random() * 100);
        timestamp = moment(timestamp).subtract(hoursdiff, 'hours');
        
               
        var newEmail = {};
        newEmail.id  = Math.round(Math.random() * 1000000000000000);  
        newEmail.read = false;  
        newEmail.sent = timestamp;  
        newEmail.title = lipsum({ 
            count: Math.round(Math.random(5)),
            units: 'words', 
            format: 'plain',             
        });   
        newEmail.subject = lipsum({ 
            count: Math.round(Math.random(8)),
            units: 'words', 
            format: 'plain',             
        });  
        
        //auto mark less than 1 of 5 as plaintext
        newEmail.contentType = Math.round(Math.random(5)) % 5 === 0 ? 'TEXT' : 'HTML';   
        
        newMessages.concat(newEmail);         
    }
    
    return newMessages;
};

Inbox.prototype.deleteMessageById = function deleteMessageById( deletionTarget ){
    this.messages = this.messages.filter(function (element){
        return element.id != deletionTarget;
    });
};

Inbox.prototype.getInboxHeaders = function(){
    
};

module.exports = Inbox;