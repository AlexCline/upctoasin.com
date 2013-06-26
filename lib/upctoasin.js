var fs              = require('fs'),
    OperationHelper = require('apac').OperationHelper,
    path            = require('path'),
    yaml            = require('js-yaml');

(function() {
  var upctoasin = {};
  var basepath = path.join(__dirname, '..');
  var config = yaml.load(fs.readFileSync(path.join(basepath, 'conf/config.yaml'), 'utf8'));
  var aws = yaml.load(fs.readFileSync(path.join(basepath, 'conf/aws.yaml'), 'utf8'));

  upctoasin.lookup = function(data, callback){

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
  };

  upctoasin.getConfig = function(callback){
    callback(null, config);
  };

  upctoasin.getAWSCredentials = function(callback){
    callback(null, aws);
  };

  module.exports = upctoasin;
}());