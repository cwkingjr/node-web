'use strict';

const R = require('ramda');

const errors = require('src/services/customErrors');
const cryptoService = require('src/services/cryptoService');
const {User} = require('src/models');

const ALLOWED_INPUT_FIELDS = ['email', 'firstName', 'lastName', 'password'];
const ALLOWED_OUTPUT_FIELDS = ['id', 'email', 'firstName', 'lastName', 'createdAt', 'updatedAt'];
const MAX_VERIFICATION_CODE_HOURS = 24;


function isPassword(user, password) {
	return cryptoService
		.hashPassword(password, user.passwordSalt)
		.then(function (hashedPassword) {
			return user.passwordHash === hashedPassword;
		});
}

function isVerificationCodeTimeInWindow(user) {
	const rightNow = new Date();
	const createdAt = new Date(user.verificationCodeCreatedAt);
	const maxTime = createdAt.setHours(createdAt.getHours() + MAX_VERIFICATION_CODE_HOURS);
	return maxTime >= rightNow;
}

function resetForNewVerification(user) {
	return cryptoService.generateVerificationCode()
		.then( verificationCode => {
			user.verificationCode = verificationCode;
			user.verificationCodeCreatedAt = new Date;
			return user.save();
		});
}

function restrictFields(users, fields) {
	const restrict = R.pick(fields);
	return Array.isArray(users) ? R.map(restrict, users) : restrict(users);
}

function restrictInputFields(users) {
	return restrictFields(users, ALLOWED_INPUT_FIELDS);
}

function restrictOutputFields(users) {
	return restrictFields(users, ALLOWED_OUTPUT_FIELDS);
}

function setAsVerified(user, password, verificationCode) {

	if (user.isVerified === true) {
		return Promise.reject('User already verified');
	}

	if (user.verificationCode !== verificationCode) {
		return Promise.reject('Invalid verification code');
	}

	if (!isVerificationCodeTimeInWindow(user)) {
		return Promise.reject(`Verification exceeded time window of ${MAX_VERIFICATION_CODE_HOURS} hours`);
	}

	return isPassword(user, password)
		.then( () => {
			user.isVerified = true;
			user.verificationCode = null;
			user.verificationCodeCreatedAt = null;
			return user.save();
		});
}

function createUser(reqBody) {
	return User
		.findByEmail(reqBody.email)
		.then( user => {
			return Promise.reject(new errors.ForbiddenError('Email is already in use'));
		})
		.catch( err => {
			return User.create(reqBody);
		});
}

async function loginUser(email, password) {
	let user = await User.findByEmail(email);
	let pwMatches = await isPassword(user, password);

	if (pwMatches !== true ) {
		return Promise.reject(new errors.UnauthorizedError('Password incorrect'));
	}
	if (user.isVerified !== true) {
		return Promise.reject(new errors.ForbiddenError('User is not verified'));
	}
	return Promise.resolve(user);
}

function verifyUser(email, password, verificationCode) {
	return User
		.findByEmail(email)
		.then( user => {
			return setAsVerified(user, password, verificationCode);
		});
}

module.exports = {
	createUser,
	loginUser,
	resetForNewVerification,
	restrictInputFields,
	restrictOutputFields,
	verifyUser
};
