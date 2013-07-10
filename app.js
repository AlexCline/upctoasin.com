var amazon      = require('./lib/amazon.js'),
    express     = require('express'),
    fs          = require('fs'),
    nodealytics = require('nodealytics'),
    path        = require('path'),
    sqlite      = require('./lib/sqlite.js'),
    yaml        = require('js-yaml');

var app = express();
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(errorHandler);
app.use(express.static(__dirname + '/public'));
app.use(app.router);
app.enable('trust proxy');

var google = yaml.load(fs.readFileSync(path.join(__dirname, 'conf/google.yaml'), 'utf8'));

app.get('/[0-9]{12}[0-9]?', function(req, res){
  nodealytics.initialize(google.id, google.domain, function () {
    nodealytics.trackPage('UPC Lookup', req.url, function (err, resp) {
      if (err || resp.statusCode != 200) {
        console.log('Error tracking with Google Analytics: ' + err);
      }
    });
  });
  // Check if the UPC is in the db
  upc = req.url.slice(1);
  sqlite.lookup(upc, function(err, result){
    // If it's not in the db, query amazon
    if(!result) {
      amazon.lookup(upc, function(err, result){
        // Save the upc and asin to the db if it's valid.
        if (result != 'UPCNOTFOUND')
          sqlite.cache(upc, result, function(err, result){});
        
        res.send(result);
      });
    } else {
      res.send(result);
    }
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
