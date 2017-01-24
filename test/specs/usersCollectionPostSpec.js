'use strict';

const HttpStatus = require('http-status-codes');
const R = require('ramda');

const request = require('test/request');
const {User} = require('src/models');


describe('POST /users', function () {

	beforeEach(function (done) {
		User.destroy({where: {}}).then(done);
	});

	it('returns the user when one is created', function(done) {
		request({
			method: 'POST',
			url: '/users',
			body: {
				email: 'gooduser@test.com',
				password: 'mypasswordmypassword',
				firstName: 'Firstname',
				lastName: 'Lastname'
			}
		}, function (err, res, body) {
			expect(res.statusCode).toBe(HttpStatus.CREATED);
			expect(body).toBeUser();
			expect(body.email).toBe('gooduser@test.com');
			expect(body.firstName).toBe('Firstname');
			expect(body.lastName).toBe('Lastname');
			done();
		});
	});

	it('filters out non-allowed input fields', function(done) {
		request({
			method: 'POST',
			url: '/users',
			body: {
				id: 99999999999999,
				email: 'hacker@test.com',
				password: 'mypasswordmypassword',
				firstName: 'Firstname',
				lastName: 'Lastname',
				passwordHash: 'injected-hash',
				passwordSalt: 'injected-salt',
				isVerified: true,
				verificationCode: 'injected-code',
				verificationCodeCreatedAt: new Date('2016-10-04T04:33:31.280Z'),
				createdAt: new Date('2016-10-04T04:33:31.280Z'),
				updatedAt: new Date('2016-10-04T04:33:31.280Z')
			}
		}, function (err, res, body) {
			expect(res.statusCode).toBe(HttpStatus.CREATED);
			expect(body).toBeUser();
			expect(body.email).toBe('hacker@test.com');
			expect(body.firstName).toBe('Firstname');
			expect(body.lastName).toBe('Lastname');

			User.findById(body.id)
			.then(function(user){
				expect(user.id).not.toBe(99999999999999);
				expect(user.passwordHash).not.toBe('injected-hash');
				expect(user.passwordSalt).not.toBe('injected-salt');
				expect(user.isVerified).not.toBe(true);
				expect(user.verificationCode).not.toBe('injected-code');
				expect(user.verificationCodeCreatedAt).not.toBe(new Date('2016-10-04T04:33:31.280Z'));
				expect(user.createdAt).not.toBe(new Date('2016-10-04T04:33:31.280Z'));
				expect(user.updatedAt).not.toBe(new Date('2016-10-04T04:33:31.280Z'));
				done();
			})
			.catch(done.fail);
		});
	});

	describe('returns an error when the input is invalid', function () {

		const validUser = {
			email: 'valid@email.com',
			password: 'validpassword',
			firstName: 'validFirstName',
			lastName: 'validLastName'
		};

		const runs = [
			{it: 'email undefined',		user: {email: undefined},				message: 'notNull Violation: email cannot be null'},
			{it: 'email invalid',		user: {email: 'invalidemailuser.com'},	message: 'Validation error: Validation isEmail failed'},

			{it: 'password undefined',	user: {password: undefined},			message: 'notNull Violation: password cannot be null'},
			{it: 'password short',		user: {password: 'p'.repeat(11)},		message: 'Validation error: Validation len failed'},
			{it: 'password long',		user: {password: 'p'.repeat(51)},		message: 'Validation error: Validation len failed'},

			{it: 'firstName undefined',	user: {firstName: undefined},			message: 'notNull Violation: firstName cannot be null'},
			{it: 'firstName empty',		user: {firstName: ''},					message: 'Validation error: Validation len failed'},
			{it: 'firstName long',		user: {firstName: 'f'.repeat(36)},		message: 'Validation error: Validation len failed'},

			{it: 'lastName undefined',	user: {lastName: undefined},			message: 'notNull Violation: lastName cannot be null'},
			{it: 'lastName empty',		user: {lastName: ''},					message: 'Validation error: Validation len failed'},
			{it: 'lastName long',		user: {lastName: 'l'.repeat(36)},		message: 'Validation error: Validation len failed'}
		];

		runs.forEach(function (run) {
			it(`(${run.it})`, function (done) {
				request({
					method: 'POST',
					url: '/users',
					body: R.merge(validUser, run.user)
				}, function (err, res, body) {
					expect(res.statusCode).toBe(HttpStatus.BAD_REQUEST);
					expect(body.message).toBe(run.message);
					done();
				});
			});
		});
	});

	describe('when a user already exists', function () {

		beforeEach(function (done) {
			const user = {
				email: 'duplicateemail@test.com',
				password: 'passwordpassword',
				firstName: 'Firstname',
				lastName: 'Lastname'
			};
			User.create(user).then(done);
		});

		it('returns an error when the email is a duplicate', function(done) {
			request({
				method: 'POST',
				url: '/users',
				body: {
					email: 'duplicateemail@test.com',
					password: 'passwordpassword',
					firstName: 'Firstname',
					lastName: 'Lastname'
				}
			}, function (err, res, body) {
				expect(res.statusCode).toBe(HttpStatus.UNPROCESSABLE_ENTITY);
				expect(body.message).toBe('Validation error');
				done();
			});
		});
	});
});
