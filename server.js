'use strict';

//port must be 80 (or 443 for SSL) when deployed to amazon
app.set('port', process.env.PORT || 3000);

var express = require('express');
var app = express(); 

app.get('/', function indexroute(req, res) {
    res.send("I'm up.");
})


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