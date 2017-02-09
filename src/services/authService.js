'use strict';

const jwt = require('jsonwebtoken');

const config = require('config');

function createAuthToken(user) {
	/* fails
	jwt.sign({ sub: user.id }, config.jwtSecret, { expiresIn: config.authTokenTimeout },
		function (err, token) {
			if (err) {
				console.log(err);
				throw err;
			}
			return token;
		}
	);
	*/
	return jwt.sign(
		{ sub: user.id },
		config.jwtSecret,
		{ expiresIn: config.authTokenTimeout }
	);
}

function verifyAuthToken(token) {
	/* fails
	jwt.verify(
		token,
		config.jwtSecret,
		function(err, decoded) {
			if (err) {
				console.log(err);
				throw err;
			} else {
				return decoded;
			}
		}
	);
	*/
	return jwt.verify(token, config.jwtSecret);
}

module.exports = {
	createAuthToken,
	verifyAuthToken
};