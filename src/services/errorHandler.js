'use strict';

const HttpStatus = require('http-status-codes');
const Sequelize = require('sequelize');

function handleError(err, req, res, next) {
	const status = err.status || HttpStatus.INTERNAL_SERVER_ERROR;
	res.status(status);
	res.json({
		message: err.message || HttpStatus.getStatusText(status),
		error: req.app.get('env') === 'development' ? err : {}
	});

	// Will never get here but this shuts up eslint unused var warning on
	// 'next', which is required for error middleware signature match
	next(err);
}

function handleSequelizeError(err, req, res, next) {
	if (err instanceof Sequelize.UniqueConstraintError) {
		err.status = HttpStatus.UNPROCESSABLE_ENTITY;
	}
	else if (err instanceof Sequelize.ValidationError) {
		err.status = HttpStatus.BAD_REQUEST;
	}

	next(err);
}

module.exports = {
	handleError,
	handleSequelizeError
};
