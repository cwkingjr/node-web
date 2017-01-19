'use strict';

const config = require('config');
const request = require('request');

const port = config.get('server.port');

module.exports = request.defaults({
	baseUrl: `http://localhost:${port}/`,
	json: true
});
