var helmet = require('helmet');
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
app.set('port', process.env.PORT || 3000); //port must be 80 (or 443 for SSL) when deployed to amazon
app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
 
var maxSupportedAPIVersion = 1 ;
var messageRoutes = require('./routes/MessageRoutes');

//FOR UPDATES
var VERSION_NUM = 0.2;


app.use(function (req, res, next) {
    console.log( req.method + " " + req.url);
    next();
});

//main API endpoint
app.use('/api/:version', function (req, res, next) {
    var versionNumber;
    if (req.params.version !== undefined && req.params.version.length >1){
        
        versionNumber = req.params.version.substring(1);
    } else {
        console.log('Error: Invalid API string');
        res.status(400).json({error:'API version must be in form of "v#"'});
        return;
    }
    
    if (isNaN(parseInt(versionNumber)) || versionNumber > maxSupportedAPIVersion ){
        console.log("ERROR: API version " + versionNumber + " not supported");
        res.status(400).json({error:"API version not supported"});
    }    
    //API routes
    else{
        next();
    }
});

app.use('/api/*/customer/messages', messageRoutes);


app.get('/', function indexroute(req, res) {
    res.send("I'm up. Ver:" + VERSION_NUM);
});


//404 Page
app.use(function (req, res) {
	res.type('text/plain');
	res.status(404);
	res.send('404 - Not Found');
});

//500 page
app.use(function (err, req, res, next) {
	console.error(err.stack);
	res.type('text/plain');
	res.status(500);
	res.send('500 - internal server error');
});


app.listen(app.get('port'), function listenStarted(){
    console.log('Express started on port '+ app.get('port') );
});