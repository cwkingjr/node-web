'use strict';

const request = require('test/request');
const {User} = require('src/models');

describe('GET /users', () => {

	beforeEach( done => {
		User.destroy({where: {}}).then(done);
	});

	describe('when there are no users', () => {

		it('responds with an empty array', done => {
			request('/users', (err, res, body) => {
				expect(res.statusCode).toBe(200);
				expect(body).toEqual([]);
				done();
			});
		});
	});

	describe('when there is one user', () => {

		beforeEach( done => {
			User.bulkCreate([
				{email: 'bob@evans.com', password: 'passwordpassword', firstName: 'Bob', lastName: 'Evans'}
			])
			.then(done)
			.catch(done.fail);
		});

		it('responds with an array of one value', done => {
			request('/users', (err, res, body) => {
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
				{email: 'bob@evans.com', password: 'passwordpassword', firstName: 'Bob', lastName: 'Evans'},
				{email: 'sara@lee.com', password: 'passwordpassword', firstName: 'Sara', lastName: 'Lee'},
				{email: 'jim@beam.com', password: 'passwordpassword', firstName: 'Jim', lastName: 'Beam'}
			]).then(done);
		});

		it('responds with an array of three values', done => {
			request('/users', (err, res, body) => {
				expect(res.statusCode).toBe(200);
				expect(body).toBeArrayOfUsers();
				expect(body.length).toBe(3);
				done();
			});
		});
	});
});
