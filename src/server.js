'use strict';

const bodyParser = require('body-parser');
const config = require('config');
const express = require('express');

const db = require('src/models');
const errorHandler = require('src/services/errorHandler');
const routes = require('src/routes');

module.exports = {
	start
};

// Returns a promise that resolves to the started server. This allows
// integration tests to wait until the server is started before executing
// any tests.
function start() {

	const app = express();

	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({ extended: false }));
	app.use('/', routes);
	app.use(errorHandler.handleSequelizeError);
	app.use(errorHandler.handleError);

	// Make sure the db is synced before starting the http server to ensure
	// a request isn't accepted prior to any database structure changes being
	// applied.
	return db.instance.sync({force:true}).then(function () {
		return new Promise(function (resolve) {
			const port = config.get('server.port');
			const server = app.listen(port, function () {
				/* eslint-disable */
				// console.log is fine in node, just not browser
				console.log(`Starting app with environment of [${app.get('env')}]`);
				console.log(`Server listening on port [${server.address().port}]`);
				/* eslint-enable */
				resolve(server);
			});
		});
	});
}
