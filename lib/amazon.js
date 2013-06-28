var fs              = require('fs'),
    OperationHelper = require('apac').OperationHelper,
    path            = require('path'),
    yaml            = require('js-yaml');

(function() {
  var amazon = {};
  var basepath = path.join(__dirname, '..');
  var config = yaml.load(fs.readFileSync(path.join(basepath, 'conf/config.yaml'), 'utf8'));
  var aws = yaml.load(fs.readFileSync(path.join(basepath, 'conf/aws.yaml'), 'utf8'));
  var timerfile = path.join(basepath, 'db/amazon_request_timer.txt');

  // This function will check the time of the last request.
  // If it happened less than a second ago, wait 1 second.
  // This is to throttle the requests to the Amazon API (limited to 1 per second).
  amazon.delay = function(callback){
    currTime = Math.floor(new Date / 1000);
    amazon.getLastReqTime(function(err, lastRun){
      if (currTime > (lastRun + 1))
        callback();
      else
        setTimeout(callback, 1000);
    });
  };

  amazon.lookup = function(data, callback){
    amazon.delay(function(){
      // Have to always create a new opHelper or else the SAX parser barfs.
      // Don't know why that is.  Should be a TODO.
      var opHelper = new OperationHelper({
        awsId:     aws.AWSAccessKeyId,
        awsSecret: aws.AWSSecretKey,
        assocId:   aws.AWSTagId,
      });

      opHelper.execute('ItemSearch', {
        'SearchIndex': 'All',
        'Keywords': data,
      }, function(error, results) {
        if (error) { console.log('Error: ' + error + "\n") }

        num = results.ItemSearchResponse.Items[0].TotalResults[0];
        if (num == 0) {
          error = 'No item found matching that UPC.';
          ASIN  = 'UPCNOTFOUND';
        } else if (num >= 1) {
          ASIN = results.ItemSearchResponse.Items[0].Item[0].ASIN[0];
        }

        if (num > 1)
          error = 'More than one possible result returned.  Using the first ASIN.';

        callback(error, ASIN);
      });
    });
  };

  amazon.timerFileInit = function(callback){
    fs.exists(timerfile, function(exists){
      if(!exists){
        fs.open(timerfile, 'w', function(err, data){
          callback(err, data);
        });
      } else 
        callback();
    });
  };

  amazon.getLastReqTime = function(callback){
    amazon.timerFileInit(function(){
      fs.readFile(timerfile, function(err, data){
        if (data == "")
          time = 0
        else
          time = data
        callback(err, time);
      });
    });
  };

  amazon.setLastReqTime = function(time, callback){
    amazon.timerFileInit(function(){
      fs.writeFile(timerfile, time, function(err){
        callback(err, null);
      });
    });
  };

  amazon.getConfig = function(){
    return config;
  };

  amazon.getAWSCredentials = function(){
    return aws;
  };

  module.exports = amazon;
}());