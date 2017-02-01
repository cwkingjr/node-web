"use strict";

const fs = require('fs');
const path = require('path');

const database = require('src/services/database');

const db = {};

fs
	.readdirSync(__dirname)
	.filter(function (file) {
		// grab only the model files
		return (file.indexOf('.') !== 0) && (file !== 'index.js');
	})
	.forEach(function (file) {
		// load the models
		const model = database.instance.import(path.join(__dirname, file));
		db[model.name] = model;
	});

// add the model relations/associations
Object.keys(db).forEach(function (modelName) {
	if ('associate' in db[modelName]) {
		db[modelName].associate(db);
	}
});

db.instance = database.instance;
db.Sequelize = database.Sequelize;

module.exports = db;