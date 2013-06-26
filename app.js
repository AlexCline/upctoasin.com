var express   = require('express'),
		path      = require('path'),
		upctoasin = require('./lib/upctoasin.js');

var app = express();
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(errorHandler);
app.use(express.static(__dirname + '/public'));
app.use(app.router);
//app.enable('trust proxy');

app.get('/[0-9]{12}', function(req, res){
	upctoasin.lookup(req.url, function(err, data){
		res.send(data);
	});
});

app.get('*', function(req, res){
	res.redirect('/');
});

function errorHandler(err, req, res, next) {
  res.status(500);
  res.render('error', { error: err });
}


app.listen(3000);
console.log('Listening on port 3000');