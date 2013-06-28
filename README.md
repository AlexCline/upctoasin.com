UPCtoASIN.com
=============

[![Build Status](https://travis-ci.org/AlexCline/upctoasin.com.png?branch=master)](https://travis-ci.org/AlexCline/upctoasin.com) [![Coverage Status](https://coveralls.io/repos/AlexCline/upctoasin.com/badge.png)](https://coveralls.io/r/AlexCline/upctoasin.com)


UPCtoASIN.com -- A website to easily convert a UPC to an ASIN.

Features
--------

1. There is an sqlite database used for caching lookups.
2. Requests to the Amazon API are throttled to 1 request/sec.

Installation
------------

    git clone git@github.com:AlexCline/upctoasin.com.git
    cd upctoasin.com
    npm install
    make test
    node app.js

Also needed is a file at `conf/aws.conf` with the following contents:

    AWSAccessKeyId: YOURAWSACCESSID
    AWSSecretKey: YOURAWSSECRETKEY
    AWSTagId: YOURAWSASSOCTAGID

### Mac OS X

You'll also need to specify the path to XCode before you run `npm install`.  This is needed for the `sqlite3` module.

    sudo xcode-select --switch /usr/bin

### CentOS

You'll need the following packages to build the required modules:

    sudo yum install make