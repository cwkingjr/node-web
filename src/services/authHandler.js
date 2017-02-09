'use strict';

const authService = require('src/services/authService');

function processAuthCookie(req, res, next) {
	if ('auth_token' in req.cookies) {
		try {
			const payload = authService.verifyAuthToken(req.cookies.auth_token);
			console.log(payload.sub); //remove
			req.userId = payload.sub;
			res.userId = payload.sub;
			next();
		}
		catch(err) {
			next(err);
		}
	}
    else {
		next();
	}
}

module.exports = {
	processAuthCookie
};