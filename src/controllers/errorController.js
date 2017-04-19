'use strict';

const HttpStatus = require('http-status-codes');

function unknownRoute(req, res, next) {
	const err = new Error();
	err.status = HttpStatus.NOT_FOUND;
	return next(err);
}

module.exports = {
	unknownRoute
};