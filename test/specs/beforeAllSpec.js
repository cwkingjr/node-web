'use strict';
require('rootpath')();

const server = require('src/server');

beforeAll(function (done) {
	server.start().then(done);
});
