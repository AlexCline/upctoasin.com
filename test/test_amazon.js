var should = require('should');

var amazon = process.env.EXPRESS_COV
   ? require('../lib-cov/amazon.js')
   : require('../lib/amazon.js');

describe('UPCtoASIN.com -- Amazon Lookup Module', function(){
  describe('#lookup()', function(){

    it('returns the correct ASIN for a known UPC (API)', function(done){
      // This is the UPC for the Serenity Blu-Ray
      amazon.lookup('025192107900', function(err, data){
        data.should.equal('B004ZJZPXO');
        done();
      });
    });

    it('returns an error for a UPC with multiple items (API)', function(done){
      amazon.lookup('000000000000', function(err, data){
        err.should.not.equal(null);
        data.should.not.equal(null);
        done();
      });
    });

    it('returns an error for a UPC with no items (API)', function(done){
      amazon.lookup('012345678901', function(err, data){
        err.should.not.equal(null);
        data.should.equal('UPCNOTFOUND');
        done();
      });
    });
  });

  describe('#getLastReqTime()', function(){
    it('returns a timestamp', function(done){
      amazon.getLastReqTime(function(err, results){
        regex = /^\d{10}$/
        regex.test(results).should.equal(true);
        done();
      });
    });
  });

  describe('#setLastReqTime()', function(){
    it('returns a timestamp', function(done){
      amazon.setLastReqTime(Math.floor(new Date / 1000), function(err, results){
        should.not.exist(err);
        done();
      });
    });
  });

  describe('#getConfig()', function(){
    var config = null;
    before(function(){
      config = amazon.getConfig();
    });

    it('has a non-null config object', function(){
      config.should.not.equal(null);
    });

    it('has a valid log file location', function(){
      should.exist(config.logfile);
    });

    it('has a valid dbpath', function(){
      should.exist(config.dbpath);
    });
  });

  describe('#getAWSCredentials() (API)', function(){
    var creds = null;
    before(function(){
      creds = amazon.getAWSCredentials();
    });

    it('has a non-null creds object', function(){
      creds.should.not.equal(null);
    });

    it('has a valid AWSAccessKeyId value', function(){
      should.exist(creds.AWSAccessKeyId);
    });

    it('has a valid AWSSecretKey value', function(){
      should.exist(creds.AWSSecretKey);
    });

    it('has a valid AWSTagId value', function(){
      should.exist(creds.AWSTagId);
    });
  });
});