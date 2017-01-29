'use strict';

const crypto = require('crypto');

const HASH_DIGEST = 'sha512';
const KEY_LENGTH = 30;
const NUM_HASH_ITERATIONS = 10555;
const VERIFICATION_CODE_LENGTH = 25;
const SALT_LENGTH = 20;

function generateRandomString(stringLength) {
	return new Promise(function (resolve, reject) {
		crypto.randomBytes(stringLength, (err, buf) => {
			if (err) {
				return reject(err);
			}
			const randomString = buf.toString('hex');
			return resolve(randomString);
		});
	});
}

function generateSalt() {
	return generateRandomString(SALT_LENGTH);
}

function generateVerificationCode() {
	return generateRandomString(VERIFICATION_CODE_LENGTH);
}

function hashPassword(password, salt) {
	return new Promise( (resolve, reject) => {
		if (!password || !salt) {
			return reject(new Error('hashPassword requires a password and salt'));
		}
		crypto.pbkdf2(password, salt, NUM_HASH_ITERATIONS, KEY_LENGTH, HASH_DIGEST, (err, hashRaw) => {
			if (err) {
				return reject(err);
			}
			const myHash = new Buffer(hashRaw, 'binary').toString('hex');
			return resolve(myHash);
		});
	});
}

module.exports = {
	generateSalt,
	generateVerificationCode,
	hashPassword
};
