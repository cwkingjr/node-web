'use strict';

const request = require('test/request');
const User = require('src/models/User');

describe('GET /users', function () {

	beforeEach(function (done) {
		User.destroy({where: {}}).then(done);
	});

	describe('when there are no users', function () {

		it('responds with an empty array', function(done) {
			request('/users', function (err, res, body) {
				expect(res.statusCode).toBe(200);
				expect(body).toEqual([]);
				done();
			});
		});
	});

	describe('when there is one user', function () {

		beforeEach(function (done) {
			User.bulkCreate([
				{email: 'bob@evans.com', password: 'passwordpassword', firstName: 'Bob', lastName: 'Evans'}
			]).then(done);
		});

		it('responds with an array of one value', function (done) {
			request('/users', function (err, res, body) {
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

	describe('when there are three users', function () {

		beforeEach(function (done) {
			User.bulkCreate([
				{email: 'bob@evans.com', password: 'passwordpassword', firstName: 'Bob', lastName: 'Evans'},
				{email: 'sara@lee.com', password: 'passwordpassword', firstName: 'Sara', lastName: 'Lee'},
				{email: 'jim@beam.com', password: 'passwordpassword', firstName: 'Jim', lastName: 'Beam'}
			]).then(done);
		});

		it('responds with an array of three values', function (done) {
			request('/users', function (err, res, body) {
				expect(res.statusCode).toBe(200);
				expect(body).toBeArrayOfUsers();
				expect(body.length).toBe(3);
				done();
			});
		});
	});
});
