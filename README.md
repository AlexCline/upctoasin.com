UPCtoASIN.com
=============

UPCtoASIN.com -- A website to easily convert a UPC to an ASIN.

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

