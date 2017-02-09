'use strict';

const request = require('request');

const config = require('config');

const port = config.get('server.port');

module.exports = request.defaults({
	baseUrl: `http://localhost:${port}/`,
	json: true
});
