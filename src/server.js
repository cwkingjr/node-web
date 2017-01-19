'use strict';

const bodyParser = require('body-parser');
const config = require('config');
const db = require('src/services/db');
const errorHandler = require('src/services/errorHandler');
const express = require('express');
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
	return db.instance.sync().then(function () {
		return new Promise(function (resolve) {
			const port = config.get('server.port');
			const server = app.listen(port, function () {
				console.log(`Starting app with environment of [${app.get('env')}]`);
				console.log(`Server listening on port [${server.address().port}]`);
				resolve(server);
			});
		});
	});
}
