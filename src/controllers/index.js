'use strict';

const fs = require('fs');

const CONTROLLER_SUFFIX = 'Controller.js';

const controllers = {};
const files = fs.readdirSync(__dirname);
files.forEach(function (file) {
	if (file.endsWith(CONTROLLER_SUFFIX)) {
		const shortName = file.replace(CONTROLLER_SUFFIX, '');
		controllers[shortName] = require(`${__dirname}/${file}`);
	}
});

module.exports = controllers;
