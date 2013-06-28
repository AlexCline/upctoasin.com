var fs     = require('fs'),
    path   = require('path'),
    should = require('should'),
    yaml   = require('js-yaml');;

var sqlite = process.env.EXPRESS_COV
   ? require('../lib-cov/sqlite.js')
   : require('../lib/sqlite.js');

var basepath = path.join(__dirname, '..');
var data = yaml.load(fs.readFileSync(path.join(basepath, 'conf/config.yaml'), 'utf8'));


describe('UPCtoASIN.com -- SQLite Caching Module', function(){

  describe('#lookup()', function(){
    it('returns null when looking up a UPC not in the db', function(done){
      sqlite.lookup('000000000000', function(err, result){
        should.not.exist(result);
        err.should.not.equal(null);
        done();
      });
    });

    it('returns the ASIN of a UPC in the db', function(done){
      sqlite.cache(data.test.upc, data.test.asin, function(err, result){
        sqlite.lookup(data.test.upc, function(err, result){
          should.exist(result);
          should.not.exist(err);
          done();
        });
      });
    });
  });

  describe('#cleanup()', function(){
    it('removes the test UPC/ASIN from the db', function(done){
      sqlite.cleanup(function(err, result){
        should.not.exist(err);
        sqlite.lookup(data.test.upc, function(err, result){
          should.not.exist(result);
          err.should.not.equal(null);
          done();
        });
      });
    });
  });

  describe('#cache()', function(){
    // This tries to save the same info twice.
    it('returns an error when saving a duplicate UPC/ASIN to the db', function(done){
      sqlite.cache(data.test.upc, data.test.asin, function(err, result){
        sqlite.cache(data.test.upc, data.test.asin, function(err, result){
          err.should.not.equal(null);
          done();
        });
      });
    });

    // This one removes the test UPC/ASIN from the db, then adds it again.
    it('returns a non-null object when saving a UPC/ASIN to the db', function(done){
      sqlite.cleanup(function(err, result){  
        sqlite.cache(data.test.upc, data.test.asin, function(err, result){
          should.not.exist(err);
          done();
        });
      });
    });
  });

  describe('#getConfig()', function(){
    var config = null;
    before(function(){
      config = sqlite.getConfig();
    });

    it('has a non-null config object', function(){
      config.should.not.equal(null);
    });

    it('has a valid database path', function(){
      should.exist(config.dbpath);
    });

    it('has a valid test UPC', function(){
      should.exist(config.test.upc);
    });

    it('has a valid test ASIN', function(){
      should.exist(config.test.asin);
    });
  });
});