'use strict';

const  logger  	= require('../../services/LoggerService.js');
const  uService = require('../uService.js');

exports.index = function(req, res) {
	var db = req.app.get('db');
	uService.getOrgs(db)
  .then(data => {
    res.json(data);
  })
  .catch(err => {
    logger.error('getOrgs error: ', err);
    res.status(500).send(err);
  });
};
