'use strict';

const matchers = require('jasmine-expect');
const R = require('ramda');

require('jasmine-matchers-loader').add({
	toBeUser,
	toBeArrayOfUsers: R.all(toBeUser)
});

function toBeUser(actual) {
	const userFields = ['id', 'email', 'firstName', 'lastName', 'createdAt', 'updatedAt'].sort();
	const actualFields = R.keys(actual).sort();

	return R.equals(actualFields, userFields) &&
		matchers.toBeWholeNumber(actual.id) &&
		matchers.toBeString(actual.email) &&
		matchers.toBeString(actual.firstName) &&
		matchers.toBeString(actual.lastName) &&
		matchers.toBeIso8601(actual.createdAt) &&
		matchers.toBeIso8601(actual.updatedAt);
}
