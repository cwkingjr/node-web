'use strict';

const HttpStatus = require('http-status-codes');

const request = require('test/request');
const {User} = require('src/models');

describe('POST /user-verifications', function () {

	beforeEach( done => {
		User.destroy({where: {}})
		.then( () => {
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

	it('processes valid email, password, and verification code', done => {

		User
			.findByEmail('bob@evans.com')
			.then( user => {
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
				request( myRequestParams, (err, res, body) => {
					expect(body).toBeUser();
					User
						.findByEmail('bob@evans.com')
						.then( verifieduser => {
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
