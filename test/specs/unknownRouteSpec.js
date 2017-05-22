'use strict';

const HttpStatus = require('http-status-codes');

const request = require('test/requestConfig');

describe('GET /unknown-route', () => {

	it('returns a 404', done => {
		request('/unknown-route', (err, res, body) => {
			expect(res.statusCode).toBe(HttpStatus.NOT_FOUND);
			expect(body.message).toBe('Not Found');
			done();
		});
	});
});
