DOCS = docs/*.md
REPORTER = spec
export PATH := $(PATH)

test:
	@NODE_ENV=test ./node_modules/mocha/bin/mocha -R $(REPORTER) $(OPTS)

test-no-aws:
	echo TRAVIS_JOB_ID $(TRAVIS_JOB_ID)
	@EXPRESS_COV=1 $(MAKE) test REPORTER=mocha-lcov-reporter OPTS="-i -g AWS" | ./node_modules/coveralls/bin/coveralls.js
	@rm lib-cov/*

test-ci:
	$(MAKE) test REPORTER=min OPTS="-w"

test-cov: lib-cov
	@EXPRESS_COV=1 $(MAKE) test REPORTER=html-cov > coverage.html
	@rm lib-cov/*

lib-cov:
	./node_modules/jscoverage/bin/jscoverage lib lib-cov

.PHONY: test