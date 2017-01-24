'use strict';

const HttpStatus = require('http-status-codes');
const {User} = require('src/models');
const userService = require('src/services/userService');

module.exports = {
	list,
	register,
	verify
};

function list(req, res, next) {
	User
		.findAll()
		.then(userService.restrictOutputFields)
		.then(res.json.bind(res))
		.catch(next);
}

function register(req, res, next){
	User
		.create(userService.restrictInputFields(req.body))
		.then(userService.restrictOutputFields)
		.then(user => {
			res.status(HttpStatus.CREATED);
			res.json(user);
		})
		.catch(next);
}

function verify(req, res, next) {
	userService
		.verifyUser(req.body.email, req.body.password, req.body.verificationCode)
		.then(userService.restrictOutputFields)
		.then(res.json.bind(res))
		.catch(next);
}
