'use strict';

const cryptoService = require('src/services/cryptoService');

module.exports = (sequelize, DataTypes) => {

	const User = sequelize.define('User', {
		email: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
			validate: {
                len: [6, 60],
				isEmail: true
			}
		},
        firstName: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [1, 35]
            }
        },
        lastName: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [1, 35]
            }
        },
        password: {
            type: DataTypes.VIRTUAL,
            allowNull: false,
            set: function (val) {
                // validate incoming unhashed password
                this.setDataValue('password', val);
            },
            validate: {
                len: [12, 50]
            }
        },
        passwordHash: {
            type: DataTypes.STRING
        },
        passwordSalt: {
            type: DataTypes.STRING
        },
        isVerified: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        verificationCode: {
            type: DataTypes.STRING
        },
        verificationCodeCreatedAt: {
            type: DataTypes.DATE
        }
	},
	{
		classMethods: {
			findByEmail: function (email) {
				return this.findOne({where: {email: email}});
			}
		},
		hooks: {
            beforeCreate: async user => {
                let salt = await cryptoService.generateSalt();
                let hashedPassword = await cryptoService.hashPassword(user.password, salt);
                let verificationCode = await cryptoService.generateVerificationCode();

                user.passwordSalt = salt;
                user.passwordHash = hashedPassword;
                user.verificationCode = verificationCode;
                user.verificationCodeCreatedAt = new Date;
			}
		}
	});

	return User;
};
