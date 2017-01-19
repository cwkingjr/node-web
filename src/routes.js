'use strict';

const router = require('express').Router();
const controllers = require('src/controllers');

router.post('/users', controllers.user.register);
router.get('/users', controllers.user.list);

router.post('/user-verifications', controllers.user.verify);

router.use(controllers.error.unknownRoute);

module.exports = router;
