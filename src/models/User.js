'use strict';

const R = require('ramda');
const db = require('src/services/db');
const cryptoService = require('src/services/cryptoService');

const ALLOWED_INPUT_FIELDS = ['email', 'password', 'firstName', 'lastName'];
const ALLOWED_OUTPUT_FIELDS = ['id', 'email', 'firstName', 'lastName', 'createdAt', 'updatedAt'];

const attributes = {
	email: {
		type: db.Sequelize.STRING,
		allowNull: false,
		unique: true,
		validate: {
			isEmail: true
		}
	},
	firstName: {
		type: db.Sequelize.STRING,
		allowNull: false,
		validate: {
			len: [1, 30]
		}
	},
	lastName: {
		type: db.Sequelize.STRING,
		allowNull: false,
		validate: {
			len: [1, 30]
		}
	},
	password: {
		type: db.Sequelize.VIRTUAL,
		allowNull: false,
		set: function (val) {
			// validate incoming password
			this.setDataValue('password', val);
		},
		validate: {
			len: [12, 50]
		}
	},
	passwordHash: {
		type: db.Sequelize.STRING
    },
	passwordSalt: {
		type: db.Sequelize.STRING
    },
	isVerified: {
		type: db.Sequelize.BOOLEAN,
		defaultValue: false
	},
	verificationCode: {
		type: db.Sequelize.STRING
	},
	verificationCodeCreatedAt: {
		type: db.Sequelize.DATE
	}
};

const options = {
	classMethods: {
		restrictInputFields: function (users) {
			const restrictInput = R.pick(ALLOWED_INPUT_FIELDS);
			return Array.isArray(users)
				? R.map(restrictInput, users)
				: restrictInput(users);
		},
		restrictOutputFields: function (users) {
			const restrictOutput = R.pick(ALLOWED_OUTPUT_FIELDS);
			return Array.isArray(users)
				? R.map(restrictOutput, users)
				: restrictOutput(users);
		}
	},
	hooks: {
		beforeCreate: function (user) {
			return cryptoService
				.generateSalt()
				.then(function (salt) {
					user.passwordSalt = salt;
					return cryptoService.hashPassword(user.password, salt);
				})
				.then(function (hashedPassword) {
					user.passwordHash = hashedPassword;
					return cryptoService.generateVerificationCode();
				})
				.then(function (verificationCode) {
					user.verificationCode = verificationCode;
					user.verificationCodeCreatedAt = new Date;
				});
		}
	}
};

module.exports = db.instance.define('User', attributes, options);
