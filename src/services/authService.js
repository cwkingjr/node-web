'use strict';

const jwt = require('jsonwebtoken');

const config = require('config');

function createAuthToken(user) {
	return jwt.sign(
		{ sub: user.id },
		config.jwtSecret,
		{ expiresIn: config.authTokenTimeout }
	);
}

function verifyAuthToken(token) {
	return jwt.verify(token, config.jwtSecret);
}

module.exports = {
	createAuthToken,
	verifyAuthToken
};