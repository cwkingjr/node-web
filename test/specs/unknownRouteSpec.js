'use strict';

const HttpStatus = require('http-status-codes');
const request = require('test/request');

describe('GET /unknown-route', function () {

	it('returns a 404', function (done) {
		request('/unknown-route', function (err, res, body) {
			expect(res.statusCode).toBe(HttpStatus.NOT_FOUND);
			expect(body.message).toBe('Not Found');
			done();
		});
	});
});
