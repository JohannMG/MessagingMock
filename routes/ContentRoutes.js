var express = require('express');
var router = express.Router();

//require loads and caches the json file automatically at server load. I <3 node sometimes... 
var LOGGED_OUT_TEMPLATE  = require('../menu-templates/MyAAA-Guest.json');
var LOGGED_IN_TEMPLATE = require('../menu-templates/MyAAA-LoggedIn.json');

var userIsLoggedIn = false;

/**
 * Checks is user is logged in or not by checking user token
 * Sets as  
 */
function loggedInOrOutUser(req, res, next){
    
   var authString = req.headers.authorization;
   
   //must has authorization header
    if ( authString === undefined || authString === ""){
        res.status(401).json({error:"Missing Auth Header"});
        return;
    }
    
    //Split between space for mode and user+pass
    var authorizationParts = authString.split(' '); // ["Basic", "BASE64-3489yt2hiu"]
    if (authorizationParts[0].toUpperCase() != 'BASIC'  || authorizationParts[1].length <2){
        res.status(401).json({error: "Must use Basic Auth"});
        return;
    }
    
    // Decode Auth String from base64, seprate into components
    var decodedAuthString = new Buffer(authorizationParts[1], 'base64').toString();
    var credentials = decodedAuthString.split(':');
    var apikey = credentials[0];
    var customerToken = credentials[1];
    
    //API key is required, customer token is optional
    if (apikey === undefined ||  apikey === "" ){
        res.status(401).json({error:'Missing API Key or Customer Token'});
        return;
    }
        
    //set logged in 
    userIsLoggedIn = ( customerToken !== undefined && customerToken.length > 0 ); 
 
    next();   
}

//hit auth function 
router.use(loggedInOrOutUser);

//Endpoint for ACG no longer requires an id
// router.get('/', function (req, res, next) {
//     res.status(404).json({ error: 'Must provide an <id> after url' });
// });

router.get('/', function (req, res, next) {
        
    if (userIsLoggedIn){
        res.status(200).json(LOGGED_IN_TEMPLATE);
        
    } else{
        res.status(200).json(LOGGED_OUT_TEMPLATE);
    }
    
});
 
 //sending routing mini-'app' back
 module.exports = router;