var express = require('express');
var router = express.Router();
var validator = require('validator');
var moment = require('moment');

var Users = require('../UserProfiles.js');
var loggedInCheck = require('../Modules/AuthChecker.js'); 
var loginProfiles = new Users();

//var mockAuthenticator = require('../Modules/AuthChecker.js');


//check basic auth header was sent
router.use(function checkHasAuthHeader(req, res, next) {
    
    if (req.headers.authorization === undefined || req.headers.authorization === ""){
        res.status(401).json({error: "Must use Basic Auth to pass API token"});
        return;
    }
    
    var authStringParts = req.headers.authorization.split(' ');
    if (authStringParts[0].toUpperCase() != 'BASIC'  || authStringParts[1].length <2){
        res.status(401).json({error: "Must use Basic Auth to pass API token"});
        return;
    }
    
    next();
});

/**
 * Endpoint to check if token always validated
 * No parametes. Must be authenticated with BASIC Auth of APIKey: Customer Token
 * Uses AuthChecker.js to validate proper BASIC auth for logged in user provided. 
 *      When success, adds customer token to  req.customerToken
 * 
 * Response ------ 
 * Username: !This is not stored, so DUMMY VALUE provided!
 * CustomerToken: Will match what sent if sent valid BASIC Auth
 * Expiration: Date in format 2016-02-28T10:00:00
 * LastAuthenticated:  Date in format 2016-02-28T10:00:00
 */

router.get('/', loggedInCheck, function getUserAuthentication(req, res, next) {
   
    //only runs after loggedInCheck passes
    res.status(200).json({
        username: "example@AAAexample.com", 
        customerToken: req.customerToken,
        expiration: moment().add(3, 'months').toJSON(),
        lastAuthentication: moment().subtract(10, 'days').toJSON()
    });
    
});




/**
 * endpoint to create an account
 * In JSON body-------- 
 * membershipId: String(16)
 * lastName: String(20)
 * zipCode: String(5)
 * email: string (255)
 * password: string(255)
 * deviceRegType: String (4)  "APNS" || "GCM"
 * deviceRegToken: String(255) ==optional==
 * 
 * Response--------
 * username: email recieved
 * customerToken: String(36) ex: "6a3fba4b-5b33-4005-a973-0f61a0f62c04" 
 *                                [8]-[4]-[4]-[4]-[12] alphanumeric + dashes
 * expiration: expiredate in UTC "2016-02-28T12:00:00"
 * 
 * 201: new user created
 * 200: user found, new password made
 * 
 * 400: incorrect formatting
 * 404: no such membership membershipID  (get by passing all zeros :0000000)
 * 409: Last name & zip not validated  (get by passing 00000 as zip) 
 */

router.post('/', function createUserRoute(req, res, next) {
    
    //check that all types came in correctly to specs. 
    //All should be sents as strings, and defined 
    var allAreStrings = [
        'membershipId', 
        'lastName',
        'zipCode',
        'email',
        'password',
        'deviceRegType'
    ].map(function checkingFn(element, index, array) {
        return typeof req.body[element] === 'string';
        
    }).reduce(function alltrue(previousVal, currentVal, index) {
        return previousVal && currentVal; //all must be true
    }, true);
    
    if (!allAreStrings){
        res.status(400).json({"error": 'Specified content was not formatted correctly'});
        return;
    }
    
    //Email does not verify 
    if (! validator.isEmail(req.body.email) ){
        res.status(400).json({'error': 'Specified content was not formatted correctly (email did not verify) '}); 
        return;
    }
    
    //for tests return 404 if membershipId is all zeros, using weak type matching 
    if ( parseInt(req.body.membershipId) === 0) {
        res.status(404).json({'error': 'The specified memebership number does not exist.'});
        return;
    } 
    
    //for tests to get the 409 error either all zeros or zip length is not 5 digits
    if  (parseInt(req.body.zipCode) === 0 || req.body.zipCode.length != 5){
        res.status(409).json({'error': 'The specified last name and zip code could not be validated.'});
        return;
    }
    
    //~~do nothing with data b/c jsut for testing ~~ 
    
    //Randomize if user already existed at creation or not
    var randomResponseCode = Math.round(Math.random() * 100) % 2 === 0 ? 200 : 201;
    
    res.status(randomResponseCode).json({
        username: req.body.email.trim(), 
        customerToken : randomUserToken(),
        expiration: moment().add(3, 'months').toJSON()
    });
    
});


/**
 * endpoint to  get usertoken with username password
 * In JSON body-------- 
 * username: String(255)
 * pasword: String(255)
 * deviceRegType: String(4)
 * deviceRegToken: String(255) ==optional==
 * 
 * Response--------
 * username: username sent
 * customerToken: String(36) ex: "6a3fba4b-5b33-4005-a973-0f61a0f62c04" 
 *                                [8]-[4]-[4]-[4]-[12] alphanumeric + dashes
 * expiration: token expiredate ex: "2019-02-28T12:00:00"
 * lastAuthenticated: ex: "2016-01-28T12:00:00"
 * 
 * 200: user found OK
 * 
 * 400: The specific content was not formatted correctly
 * 401: username and password could not be authenticated
 */

router.put('/', function authUser(req, res, next) {
    
    //check that all types came in correctly to specs. 
    //All should be sents as strings, and defined 
    var allAreStrings = [
        'username', 
        'password',
        'deviceRegType'
    ].map(function checkingFn(element, index, array) {
        return typeof req.body[element] === 'string';
        
    }).reduce(function alltrue(previousVal, currentVal, index) {
        return previousVal && currentVal; //all must be true
    }, true);
    
    if (!allAreStrings){
        res.status(400).json({"error": 'Specified content was not formatted correctly'});
        return;
    }
    
    //purposeful fail inputs are username: failauth, password: *
    if (req.body.username === "failauth" || req.body.username.trim() === "" || req.body.password.trim() === ""){
        res.status(401).json({'error': 'The specified username and password could not be authenticated.'});
        return;
    } 
    
    //Either to be in the specified userprofiles    
    if (loginProfiles.authenticatesWithUserPass(req.body.username, req.body.password)){
        res.status(200).json({
            username: req.body.username, 
            customerToken: loginProfiles.getTokenForUsername( req.body.username ),
            expiration: moment().add(3, 'months').toJSON(),
            lastAuthentication: moment().subtract(10, 'days').toJSON()
        });
        return;
        
    } else if ( req.body.username.startsWith('please') ){ // or wildcard prefix login
        
        res.status(200).json({
            username: req.body.username.trim(),
            customerToken: randomUserToken(), 
            expiration: moment().add(3, 'months').toJSON(),
            lastAuthentication: moment().subtract(10, 'days').toJSON()
        });
        return;
    } 

    //otherwise fails    
    res.status(401).send('The specified username and password could not be authenticated.');
    
    
});



/**
 * Makes a random user token with the format [8]-[4]-[4]-[4]-[12]
 */
function randomUserToken() {
    return randomAlphaNumCharsOfLength(8) + "-" +  
            randomAlphaNumCharsOfLength(4) + "-" + 
            randomAlphaNumCharsOfLength(4) + "-" + 
            randomAlphaNumCharsOfLength(4) + "-" + 
            randomAlphaNumCharsOfLength(12) ;
}

/**
 * Returns a random string of alphanumeric characters
 * param length: length of string to bre returned
 * returns: string
 */
function randomAlphaNumCharsOfLength(length) {
    
    var createdString = "";
    
    while (createdString.length < length){
        //small randomish chance of making char a number 
        //I ackknowledge that the wasy I'm doing it is not a uniform distri.
        if (Math.round(Math.random() * 5) % 4 === 0){
            createdString += String.fromCharCode(Math.round( 48 + Math.random() * 9));
        }else {
            createdString += String.fromCharCode(Math.round( 97 + Math.random() * 25 ));
        }
    }
    
    return createdString;
    

}



//send routing 'app' back 
module.exports = router;