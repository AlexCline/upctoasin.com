REPORTER = spec
export PATH := :$(PATH)

test:
	@NODE_ENV=test ./node_modules/mocha/bin/mocha -R $(REPORTER) $(OPTS)

test-no-aws:
	@echo TRAVIS_JOB_ID $(TRAVIS_JOB_ID)
	$(MAKE) test OPTS='-i -g AWS'

test-ci:
	$(MAKE) test REPORTER=min OPTS='-w'

test-cov: lib-cov
	@UPCTOASIN_COV=1 $(MAKE) test REPORTER=html-cov > coverage.html
	@UPCTOASIN_COV=1 $(MAKE) test REPORTER=mocha-lcov-reporter | ./node_modules/coveralls/bin/coveralls.js
	
lib-cov:
	@rm -f lib-cov/*
	@./node_modules/jscoverage/bin/jscoverage lib lib-cov

.PHONY: test lib-cov