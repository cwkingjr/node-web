'use strict';

const HttpStatus = require('http-status-codes');

module.exports = {
	unknownRoute
};

function unknownRoute(req, res, next) {
	const err = new Error();
	err.status = HttpStatus.NOT_FOUND;
	return next(err);
}
