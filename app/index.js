'use strict';

const router = require('express').Router();
const api = require('./api/api');
const web = require('./api/web');
const log = require('./api/logger').logger;

router.use(web);
router.use(api);

module.exports = router;