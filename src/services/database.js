'use strict';

const config = require('config').get('database');
const Sequelize = require('sequelize');

const options = {
	dialect: 'postgres',
	define: {
		freezeTableName: true
	}
};

Object.assign(options, config.options);

const instance = new Sequelize(config.name, config.user, config.password, options);

module.exports = {
	instance,
	Sequelize
};
