TESTS = $(wildcard test/unit/*.test.js)

test:
	@./node_modules/.bin/mocha -G -R spec $(TESTS)

.PHONY: test
