module.exports = function authcheck (req, res, next){
    var reqAuth = req.headers.authorization;
    
    if ( reqAuth === undefined || reqAuth === ""){
        res.status(401).json({error:"Missing Auth Header"});
        return;
    }
    
    //Split between space for mode and user+pass
    var authorizationParts = reqAuth.split(' '); // ["Basic", "BASE64-3489yt2hiu"]
    if (authorizationParts[0].toUpperCase() != 'BASIC'  || authorizationParts[1].length <2){
        res.status(401).json({error: "Must use Basic Auth"});
        return;
    }
    
    // DEcode Auth String from base64, seprate into components
    var decodedAuthString = new Buffer(authorizationParts[1], 'base64').toString();
    var credentials = decodedAuthString.split(':');
    var apikey = credentials[0];
    var customerToken = credentials[1];
    
    //if empty, return as invalid request
    if (!(apikey) || !(customerToken)){
        res.status(401).json({error:'Missing API Key or Customer Token'});
        return;
    }
    
    //If keys long enough, print last 4 digits to console
    if (apikey.length >= 4 && customerToken >=4 ){
        console.log('Last 4 of API Key: [' + apikey.substring(apikey.length - 4) + '] Token [' + customerToken.substring(customerToken.length - 4)+']');
    }
    
    //puts customer token into request object
    req.customerToken = customerToken;
    //continues
    next();
};