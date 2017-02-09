'use strict';

const HttpStatus = require('http-status-codes');

const request = require('test/request');
const {User} = require('src/models');

describe('POST /user-verifications', function () {
	// retain cookie value across tests for reposting
	let cookie = '';

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
				expect(user.isVerified).toBeFalse();
				expect(user.verificationCode).not.toBeNull();
				expect(user.verificationCodeCreatedAt).not.toBeNull();

				const params = {
					method: 'POST',
					url: '/user-verifications',
					body: {
						email: 'bob@evans.com',
						password: 'passwordpassword',
						verificationCode: `${user.verificationCode}`
					}
				};
				request( params, (err, res, body) => {
					expect(body).toBeUser();
					User
						.findByEmail('bob@evans.com')
						.then( verifieduser => {
							expect(res.statusCode).toBe(HttpStatus.OK);
							expect(verifieduser.isVerified).toBeTrue();
							expect(verifieduser.verificationCode).toBeNull();
							expect(verifieduser.verificationCodeCreatedAt).toBeNull();
	
							cookie = res.headers['set-cookie'][0];
							expect(cookie).not.toMatch("undefined");
							expect(cookie).toMatch("auth_token");
							expect(cookie).toMatch("Expires");
							expect(cookie).toMatch("HttpOnly");
							//expect(cookie).toMatch("Secure");

							done();
						})
						.catch(done.fail);
				});
		})
		.catch(done.fail);
	});

	it('processes returned auth cookie', function(done) {
		const cookieJar = request.jar();
		// 2nd param must match request baseUrl for it to send cookie
		cookieJar.setCookie(cookie, 'http://localhost:3000/');
		//cookieJar.setCookie(cookie, request.baseUrl);

		const params = {
			method: 'GET',
			url: '/users',
			jar: cookieJar
		};

		request( params, function (err, res, body) {
			if (err) {
				console.log('get users error:',err);
				done.fail();
			}
			console.log('userId:' + res.userId);
			expect(res.userId).not.toMatch("undefined");
			done();
		});
	});
});
