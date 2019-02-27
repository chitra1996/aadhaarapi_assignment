'use strict';

const router = require('express').Router();
const api = require('./api/home')
const web = require('./web/home');

router.use(web);
router.use(api);

module.exports = router;