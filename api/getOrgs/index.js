'use strict';

const 	express 		= require('express'),
				controller  = require('./getOrgs.controller'),
				router 			= express.Router();

router.get('/', controller.index);

module.exports = router;
