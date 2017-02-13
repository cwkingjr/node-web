'use strict';

const request = require('test/request');
const {User} = require('src/models');
const {createVerifiedBobEvans} = require('test/helpers/usersHelper');

let cookie;

describe('GET /users', () => {

	beforeEach( done => {
		User.destroy({where: {}}).then(done);
	});

	describe('when auth_token missing', () => {

		it('responds with unauthorized', done => {
			request('/users', (err, res, body) => {
				expect(res.statusCode).toBe(401);
				expect(res.statusMessage).toBe('Unauthorized');
				expect(body.error).toEqual('Authentication required');
				done();
			});
		});
	});

	describe('when there is one user', () => {

		beforeEach( done => {
			createVerifiedBobEvans()
			.then(cookieVal => {
				cookie = cookieVal;
				done();
			})
			.catch(done.fail);
		});

		it('responds with an array of one value', done => {

			const cookieJar = request.jar();
			cookieJar.setCookie(cookie, 'http://localhost:3000/');

			const params = {
				method: 'GET',
				url: '/users',
				jar: cookieJar
			};

			request(params, (err, res, body) => {
				expect(res.statusCode).toBe(200);
				expect(body).toBeArrayOfUsers();
				expect(body.length).toBe(1);
				expect(body[0].email).toBe('bob@evans.com');
				expect(body[0].firstName).toBe('Bob');
				expect(body[0].lastName).toBe('Evans');
				done();
			});
		});
	});

	describe('when there are three users', () => {

		beforeEach( done => {
			User.bulkCreate([
				{email: 'sara@lee.com', password: 'passwordpassword', firstName: 'Sara', lastName: 'Lee'},
				{email: 'jim@beam.com', password: 'passwordpassword', firstName: 'Jim', lastName: 'Beam'}
			])
			.then(createVerifiedBobEvans)
			.then(cookieVal => {
				cookie = cookieVal;
				done();
			})
			.catch(done.fail);
		});

		it('responds with an array of three values', done => {

			const cookieJar = request.jar();
			cookieJar.setCookie(cookie, 'http://localhost:3000/');

			const params = {
				method: 'GET',
				url: '/users',
				jar: cookieJar
			};

			request(params, (err, res, body) => {
				expect(res.statusCode).toBe(200);
				expect(body).toBeArrayOfUsers();
				expect(body.length).toBe(3);
				done();
			});
		});
	});
});
