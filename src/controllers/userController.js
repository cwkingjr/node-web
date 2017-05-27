'use strict';

const HttpStatus = require('http-status-codes');
const config = require('config');

const {User} = require('src/models');
const authService = require('src/services/authService');
const emailService = require('src/services/emailService');
const userService = require('src/services/userService');

const cookieOptions = {
	expires: new Date(Date.now() + config.authCookieTimeout),
	httpOnly: true
	//, secure: true
};

function login(req, res, next) {
	userService
		.loginUser(req.body.email, req.body.password)
		.then(userService.restrictOutputFields)
		.then(user => res.cookie('auth_token', authService.createAuthToken(user), cookieOptions).json(user))
		.catch(next);
}

function logout(req, res) {
	res.clearCookie('auth_token').redirect(HttpStatus.OK, '/user-logins');
}

function list(req, res, next) {
	User
		.findAll()
		.then(userService.restrictOutputFields)
		.then(res.json.bind(res))
		.catch(next);
}

function register(req, res, next) {
	userService
		.createUser(userService.restrictInputFields(req.body))
		.then(emailService.sendUserVerificationEmail)
		.then(userService.restrictOutputFields)
		.then(user => res.status(HttpStatus.CREATED).json(user))
		.catch(next);
}

function verify(req, res, next) {
	userService
		.verifyUser(req.body.email, req.body.password, req.body.verificationCode)
		.then(userService.restrictOutputFields)
		.then(user => res.cookie('auth_token', authService.createAuthToken(user), cookieOptions).json(user))
		.catch(next);
}

module.exports = {
	list,
	login,
	logout,
	register,
	verify
};