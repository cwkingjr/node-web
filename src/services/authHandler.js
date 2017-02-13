'use strict';

const HttpStatus = require('http-status-codes');

const authService = require('src/services/authService');

function requireAuth(req, res, next) {
	if ('auth_token' in req.cookies) {
		try {
			const payload = authService.verifyAuthToken(req.cookies.auth_token);
			req.userId = payload.sub;
			next();
		}
		catch(err) {
			next(err);
		}
	}
    else {
		res.status(HttpStatus.UNAUTHORIZED);
		res.json({error: "Authentication required"});
	}
}

module.exports = {
	requireAuth
};