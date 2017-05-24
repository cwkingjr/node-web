'use strict';

require('jasmine-expect');
const addMatchers = require('add-matchers');
const R = require('ramda');

// Is there a way to import these via jasmine-expect.matchersByName?
const toBeWholeNumber = require('jasmine-expect/src/toBeWholeNumber');
const toBeString = require('jasmine-expect/src/toBeString');
const toBeIso8601 = require('jasmine-expect/src/toBeIso8601');

addMatchers({
	toBeUser,
	toBeArrayOfUsers: R.all(toBeUser)
});

function toBeUser(actual) {
	const userFields = ['id', 'email', 'firstName', 'lastName', 'createdAt', 'updatedAt'].sort();
	const actualFields = R.keys(actual).sort();

	return R.equals(actualFields, userFields) &&
		toBeWholeNumber(actual.id) &&
		toBeString(actual.email) &&
		toBeString(actual.firstName) &&
		toBeString(actual.lastName) &&
		toBeIso8601(actual.createdAt) &&
		toBeIso8601(actual.updatedAt);
}
