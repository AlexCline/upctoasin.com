var should = require('should');

var amazon = process.env.EXPRESS_COV
   ? require('../lib-cov/amazon.js')
   : require('../lib/amazon.js');

xdescribe('UPCtoASIN.com -- Amazon Lookup Module', function(){
  describe('#lookup()', function(){

    it('returns the correct ASIN for a known UPC', function(done){
      // This is the UPC for the Serenity Blu-Ray
      amazon.lookup('025192107900', function(err, data){
        data.should.equal('B004ZJZPXO');
        done();
      });
    });

    it('returns an error for a UPC with multiple items', function(done){
      amazon.lookup('000000000000', function(err, data){
        err.should.not.equal(null);
        data.should.not.equal(null);
        done();
      });
    });

    it('returns an error for a UPC with no items', function(done){
      amazon.lookup('012345678901', function(err, data){
        err.should.not.equal(null);
        data.should.equal('UPCNOTFOUND');
        done();
      });
    });
  });

  describe('#getConfig()', function(){
    var config = null;
    before(function(){
      amazon.getConfig(function(err, data){
        config = data;
      });
    });

    it('has a non-null config object', function(){
      config.should.not.equal(null);
    });

    it('has a valid log file location', function(){
      should.exist(config.logfile);
    });
  });

  describe('#getAWSCredentials()', function(){
    var creds = null;
    before(function(){
      amazon.getAWSCredentials(function(err, data){
        creds = data;
      });
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