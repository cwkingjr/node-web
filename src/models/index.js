"use strict";

// load up all models and their associations

const fs = require('fs');
const path = require('path');

const database = require('src/services/database');

const db = {};

fs
	.readdirSync(__dirname)
	.filter(file => {
		// grab only the model files
		return (file.indexOf('.') !== 0) && (file !== 'index.js');
	})
	.forEach(file => {
		// load the models keyed by model.name
		const model = database.instance.import(path.join(__dirname, file));
		db[model.name] = model;
	});

// add the model relations/associations if present
Object.keys(db).forEach(modelName => {
	if ('associate' in db[modelName]) {
		db[modelName].associate(db);
	}
});

db.instance = database.instance;
db.Sequelize = database.Sequelize;

module.exports = db;