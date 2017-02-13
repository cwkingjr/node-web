'use strict';

require('rootpath')();

const request = require('test/request');
const {User} = require('src/models');

function createVerifiedBobEvans() {
	return new Promise( (resolve, reject) => {
		User.create({
			email: 'bob@evans.com',
			password: 'passwordpassword',
			firstName: 'Bob',
			lastName: 'Evans'
		})
		.then(user => {
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
				if (err) {
					return reject(err);
				}
				let cookie = res.headers['set-cookie'][0];
				return resolve(cookie);
			});
		});
	});
}

module.exports = {
	createVerifiedBobEvans
}