'use strict';

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const config = require('config');
const express = require('express');

const db = require('src/models');
const errorHandler = require('src/services/errorHandler');
const routes = require('src/routes');
const winston = require('src/winstonConfig');

module.exports = {
	start
};

// Returns a promise that resolves to the started server. This allows
// integration tests to wait until the server is started before executing
// any tests.
async function start() {

	const app = express();

	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({ extended: false }));
	app.use(cookieParser());
	app.use('/', routes);
	app.use(errorHandler.handleSequelizeError);
	app.use(errorHandler.handleError);

	// Make sure the db is synced before starting the http server to ensure
	// a request isn't accepted prior to any database structure changes being
	// applied.
    try {
        if (process.env.NODE_ENV === 'dev' || process.env.NODE_ENV === 'test') {
            // force the db sync
            await db.instance.sync({force:true});
        } else {
            // error on DDL changes -- expect devops to migrate prod
            await db.instance.sync();
        }
    }
    catch(err) {
        winston.error('Problem with db.instance.sync', { name: err.name, message: err.message });
        process.exit(0);
    }

	return new Promise(resolve => {
		const port = config.get('server.port');
		const server = app.listen(port, () => {
			winston.info(`Starting app with environment of [${process.env.NODE_ENV}]`);
			winston.info(`Server listening on port [${server.address().port}]`);
			resolve(server);
		});
	});
}
