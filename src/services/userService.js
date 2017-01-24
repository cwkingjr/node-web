'use strict';

const R = require('ramda');

const cryptoService = require('src/services/cryptoService');
const emailService = require('src/services/emailService');
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
		.then(function (verificationCode) {
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

function createUserAndSendVerificationEmail(email) {
	return User
		.findOrCreate({where: {email: email}})
		.spread(function(user, created) {
			if (!created) {
				throw new Error('email is already in use');
			} else {
				return emailService.sendUserVerificationEmail(user);
			}
		});
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

function verifyUser(email, password, verificationCode) {
	return User
		.findByEmail(email)
		.then(function (user) {
			return setAsVerified(user, password, verificationCode);
		});
}

module.exports = {
	createUserAndSendVerificationEmail,
	resetForNewVerification,
	restrictInputFields,
	restrictOutputFields,
	verifyUser
};
