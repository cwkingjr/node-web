'use strict';

const cryptoService = require('src/services/cryptoService');

const MAX_VERIFICATION_CODE_HOURS = 24;

function isPassword(user, password) {
	return cryptoService
		.hashPassword(password, user.passwordSalt)
		.then(function (hashedPassword) {
			return user.passwordHash === hashedPassword;
		});
}

function isVerified(user) {
	return user.isVerified === true;
}

function isVerificationCode(user, verificationCode) {
	return user.verificationCode === verificationCode;
}

function isVerificationCodeTimeInWindow(user) {
	const rightNow = new Date();
	const createdAt = new Date(user.verificationCodeCreatedAt);
	const maxTime = createdAt.setHours(createdAt.getHours() + MAX_VERIFICATION_CODE_HOURS);
	return maxTime >= rightNow;
}

function setAsVerified(user, password, verificationCode) {

	if (isVerified(user)) {
		return Promise.reject('User already verified');
	}

	if (!isVerificationCode(user, verificationCode)) {
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

module.exports = {
	isPassword,
	isVerified,
	isVerificationCode,
	isVerificationCodeTimeInWindow,
	setAsVerified
};
