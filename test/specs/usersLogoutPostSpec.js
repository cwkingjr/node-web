'use strict';

const HttpStatus = require('http-status-codes');

const {createVerifiedBobEvans} = require('test/helpers/usersHelper');
const request = require('test/request');
const {User} = require('src/models');

describe('POST /user-logouts', function () {

    let cookie;

	beforeEach( done => {
		User.destroy({where: {}})
		.then(createVerifiedBobEvans)
		.then(done)
		.catch(done.fail);
	});

	it('clears auth cookie for authenticated user', done => {

       const loginParams = {
            method: 'POST',
            url: '/user-logins',
            body: {
                email: 'bob@evans.com',
                password: 'passwordpassword'
            }
        };

        // login to get the auth cookie
        request( loginParams, (err, res, body) => { // eslint-disable-line no-unused-vars
            cookie = res.headers['set-cookie'][0];

            // logout
            const cookieJar = request.jar();
            cookieJar.setCookie(cookie, 'http://localhost:3000/');

            const logoutParams = {
                method: 'POST',
                url: '/user-logouts',
                jar: cookieJar
            };

            request( logoutParams, (err, res, body) => { // eslint-disable-line no-unused-vars
                expect(res.statusCode).toBe(HttpStatus.OK);
                expect(res.headers['set-cookie'][0]).toMatch('auth_token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT');
                expect(res.headers['location']).toMatch('/user-logins');
                done();
            });
        });
    });
})
