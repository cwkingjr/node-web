'use strict';

const HttpStatus = require('http-status-codes');

const {createVerifiedBobEvans} = require('test/helpers/usersHelper');
const request = require('test/requestConfig');
const {User} = require('src/models');

describe('POST /user-logins verified user', function () {

    beforeEach( done => {
        User.destroy({where: {}})
        .then(createVerifiedBobEvans)
        .then(done)
        .catch(done.fail);
    });

    it('processes valid email and password', done => {

        const params = {
            method: 'POST',
            url: '/user-logins',
            body: {
                email: 'bob@evans.com',
                password: 'passwordpassword'
            }
        };

        request( params, (err, res, body) => {
            expect(res.statusCode).toBe(HttpStatus.OK);
            expect(body).toBeUser();

            let cookie = res.headers['set-cookie'][0];
            expect(cookie).not.toMatch("undefined");
            expect(cookie).toMatch("auth_token");
            expect(cookie).toMatch("Expires");
            expect(cookie).toMatch("HttpOnly");
            //expect(cookie).toMatch("Secure");

            done();
        });
    });

    it('rejects invalid password', done => {

        const params = {
            method: 'POST',
            url: '/user-logins',
            body: {
                email: 'bob@evans.com',
                password: 'password-mismatch'
            }
        };

        request( params, (err, res, body) => { // eslint-disable-line no-unused-vars
            expect(res.statusCode).toBe(HttpStatus.UNAUTHORIZED);
            done();
        });
    });
})

describe('POST /user-logins unverified user', function () {

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

	it('rejects login with valid email and password', done => {

        const params = {
            method: 'POST',
            url: '/user-logins',
            body: {
                email: 'bob@evans.com',
                password: 'passwordpassword'
            }
        };

        request( params, (err, res, body) => { // eslint-disable-line no-unused-vars
            expect(res.statusCode).toBe(HttpStatus.FORBIDDEN);
            done();
         });
    });
})