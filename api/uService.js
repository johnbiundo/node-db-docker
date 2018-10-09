'use strict';

const logger 				= require('../services/LoggerService.js'),
			Promise    		= require('bluebird');

function getOrgs(db) {
	const query = 'SELECT * FROM orgs';
	return db.query(query);
}

module.exports = {
	getOrgs: getOrgs
}
