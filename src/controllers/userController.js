'use strict';

const HttpStatus = require('http-status-codes');
const User = require('src/models/User');
const userService = require('src/services/userService');

module.exports = {
	list,
	register,
	verify
};

function list(req, res, next) {
	User
		.findAll()
		.then(User.restrictOutputFields)
		.then(res.json.bind(res))
		.catch(next);
}

function register(req, res, next){
	User
		.create(User.restrictInputFields(req.body))
		.then(User.restrictOutputFields)
		.then(user => {
			res.status(HttpStatus.CREATED);
			res.json(user);
		})
		.catch(next);
}

function verify(req, res, next) {
	User
		.findOne({where: {email: req.body.email}})
		.then(function (user) {
			return userService.setAsVerified(user, req.body.password, req.body.verificationCode);
		})
		.then(User.restrictOutputFields)
		.then(res.json.bind(res))
		.catch(next);
}
