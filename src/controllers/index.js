'use strict';

// load up all controllers at once and return obj with controllers keyed by noun
// all controllers must be named as <noun>Controller.js
// example: userController.js

const fs = require('fs');

const controllers = {};
const CONTROLLER_SUFFIX = 'Controller.js';

const files = fs.readdirSync(__dirname);

files.forEach( file => {
	if (file.endsWith(CONTROLLER_SUFFIX)) {
		const noun = file.replace(CONTROLLER_SUFFIX, '');
		controllers[noun] = require(`${__dirname}/${file}`);
	}
});

module.exports = controllers;
