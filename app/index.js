'use strict';

const router = require('express').Router();
const api = require('./api/api');
const web = require('./api/web');

router.use(web);
router.use(api);

module.exports = router;