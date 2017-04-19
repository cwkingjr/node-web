'use strict';

const HttpStatus = require('http-status-codes');

class ExtendableError extends Error {
	constructor(message) {
		super(message);
		this.name = this.constructor.name;
		this.message = message;
		if (typeof Error.captureStackTrace === 'function') {
			Error.captureStackTrace(this, this.constructor);
		} else {
			this.stack = (new Error(message)).stack;
		}
	}
}

class BadRequestError extends ExtendableError {
	constructor(msg) {
		super(msg);
		this.status = HttpStatus.BAD_REQUEST;
	}
}

class NotFoundError extends ExtendableError {
	constructor(msg) {
		super(msg);
		this.status = HttpStatus.NOT_FOUND;
	}
}

class ForbiddenError extends ExtendableError {
	constructor(msg) {
		super(msg);
		this.status = HttpStatus.FORBIDDEN;
	}
}

class UnauthorizedError extends ExtendableError {
	constructor(msg) {
		super(msg);
		this.status = HttpStatus.UNAUTHORIZED;
	}
}

module.exports = {
	BadRequestError,
    ForbiddenError,
	NotFoundError,
	UnauthorizedError
};