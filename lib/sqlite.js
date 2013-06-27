var fs     = require('fs'),
    path   = require('path'),
    sqlite3 = require('sqlite3'),
    yaml   = require('js-yaml');

(function() {
  var sqlite = {};
  var basepath = path.join(__dirname, '..');
  var config = yaml.load(fs.readFileSync(path.join(basepath, 'conf/config.yaml'), 'utf8'));

  var dbpath = path.join(basepath, config.dbpath, 'upctoasin.sqlite');
  var db = new sqlite3.Database(dbpath);;

  sqlite.init = function(callback) {
    // Check if the upcs table exists.  If not, create it.
    db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='upcs'", function(err, row){
      if (row == undefined){
        db.run("CREATE TABLE upcs (upc TEXT UNIQUE, asin TEXT)", function(err){
          callback(err, null);
        });
      } else {
        callback(err, null);
      }
    });
  };

  sqlite.lookup = function(upc, callback) {
    sqlite.init(function(err, results){
      db.get("SELECT asin FROM upcs WHERE upc = ?", upc, 
             function(err, row) {
        if (row == undefined)
          callback("No entry for " + upc + " in Db.", null);
        else
          callback(null, row.asin);
      });
    });
  };

  sqlite.cache = function(upc, asin, callback) {
    sqlite.init(function(err, result){
      db.run("INSERT INTO upcs VALUES (?, ?)", [upc, asin], function(err, result){
        callback(err, result);
      });
    });
  };

  sqlite.cleanup = function(callback) {
    sqlite.init(function(err, result){
      db.run("DELETE FROM upcs WHERE upc = ?", config.test.upc, function(err, result){
        callback(err, result);
      });
    });
  };

  sqlite.getConfig = function(callback) {
    callback(null, config);
  };

  module.exports = sqlite;
}());