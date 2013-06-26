DOCS = docs/*.md
REPORTER = spec
export PATH := ./node_modules/mocha/bin:$(PATH)

test:
	@NODE_ENV=test mocha -R $(REPORTER)

test-ci:
	@NODE_ENV=test mocha -R min -w

test-cov: lib-cov
	@EXPRESS_COV=1 $(MAKE) test REPORTER=html-cov > coverage.html

lib-cov:
	@rm lib-cov/*
	@jscoverage lib lib-cov

.PHONY: test