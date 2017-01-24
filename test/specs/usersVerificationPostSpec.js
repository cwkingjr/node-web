'use strict';

const HttpStatus = require('http-status-codes');

const request = require('test/request');
const {User} = require('src/models');

describe('POST /user-verifications', function () {

	beforeEach(function (done) {
		User.destroy({where: {}})
		.then(function () {
			return User.create({
				email: 'bob@evans.com',
				password: 'passwordpassword',
				firstName: 'Bob',
				lastName: 'Evans'
			});
		})
		.then(done)
		.catch(done.fail);
	});

	it('processes valid email, password, and verification code', function(done) {

		User
			.findByEmail('bob@evans.com')
			.then(function (user) {
				expect(user.isVerified).toBeFalse;
				expect(user.verificationCode).notToBeNull;
				expect(user.verificationCodeCreatedAt).notToBeNull;

				const myRequestParams = {
					method: 'POST',
					url: '/user-verifications',
					body: {
						email: 'bob@evans.com',
						password: 'passwordpassword',
						verificationCode: `${user.verificationCode}`
					}
				};
				request( myRequestParams, function (err, res, body) {
					expect(body).toBeUser();
					User
						.findByEmail('bob@evans.com')
						.then(function (verifieduser) {
							expect(res.statusCode).toBe(HttpStatus.OK);
							expect(verifieduser.isVerified).toBeTrue;
							expect(verifieduser.verificationCode).toBeNull;
							expect(verifieduser.verificationCodeCreatedAt).toBeNull;
							done();
						})
						.catch(done.fail);
				});
		})
		.catch(done.fail);
	});
});
