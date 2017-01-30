'use strict';

require('rootpath')();

const server = require('src/server');

beforeAll( done => server.start().then(done) ); // eslint-disable-line
