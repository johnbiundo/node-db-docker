'use strict';

const express = require('express'),
			router = express.Router();

router.use('/getOrgs', require('./getOrgs'));

module.exports = router;
