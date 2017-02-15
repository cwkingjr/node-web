'use strict';

const router = require('express').Router();
const controllers = require('src/controllers');
const {requireAuth} = require('src/services/authHandler');

router.post('/users', controllers.user.register);
router.get('/users', requireAuth, controllers.user.list);

router.post('/user-logins', controllers.user.login);
router.post('/user-verifications', controllers.user.verify);

router.use(controllers.error.unknownRoute);

module.exports = router;
