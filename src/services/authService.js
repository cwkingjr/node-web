'use strict';

const config = require('config');
const jwt = require('jsonwebtoken');

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