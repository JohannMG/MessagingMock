var helmet = require('helmet');
var express = require('express');
var app = express();
app.set('port', process.env.PORT || 3000); //port must be 80 (or 443 for SSL) when deployed to amazon
app.use(helmet())
 
var maxSupportedAPIVersion = 1 ;
var messageRoutes = require('./routes/MessageRoutes');



app.use(function (req, res, next) {
    console.log( req.method + " " + req.url);
    next();
})

//main API endpoint
app.use('/api/:version', function (req, res, next) {
    if (isNaN(parseInt(req.params.version)) || req.params.version > maxSupportedAPIVersion ){
        console.log("ERROR: API version " + req.params.version + " not supported");
        res.status(400).json({error:"API version not supported"});
    }    
    //API routes
    else{
        next();
    }
});

app.use('/api/*/customer/messages', messageRoutes);


app.get('/', function indexroute(req, res) {
    res.send("I'm up.");
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