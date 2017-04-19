'use strict';

const config = require('config');
const Sequelize = require('sequelize');

const dbConfig = config.get('database');
const postgresOptions = {
	dialect: 'postgres',
	define: {
		freezeTableName: true
	}
};

// merge db options into pg options
Object.assign(postgresOptions, dbConfig.options);

const instance = new Sequelize(dbConfig.name, dbConfig.user, dbConfig.password, postgresOptions);

module.exports = {
	instance,
	Sequelize
};
