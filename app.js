var amazon  = require('./lib/amazon.js'),
    express = require('express'),
    path    = require('path'),
    sqlite  = require('./lib/sqlite.js');

var app = express();
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(errorHandler);
app.use(express.static(__dirname + '/public'));
app.use(app.router);
app.enable('trust proxy');

app.get('/[0-9]{12}', function(req, res){
  // Check if the UPC is in the db
  upc = req.url.slice(1);
  sqlite.lookup(upc, function(err, result){
    if(!result) {
      amazon.lookup(upc, function(err, result){
        sqlite.cache(upc, result, function(err, result){});
        res.send(result);
      });
    } else {
      res.send(result);
    }
  });

  // If not in the db, lookup via amazon

  // If not in amazon, save to db
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