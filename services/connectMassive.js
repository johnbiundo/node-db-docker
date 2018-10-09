// our config settings
const massive = require('massive');
const Promise = require('bluebird');
const logger = require('./LoggerService.js');

// postgres
const pg_user_name 	= process.env.TEST_DB_USER;
const pg_password 	= process.env.TEST_DB_PASSWORD;
const pg_host 			= process.env.TEST_DB_HOST;
const pg_dbname 		= process.env.TEST_DB_NAME;

//MassiveJS connection settings
var conSettings = {
	host: pg_host,
	port: 5432,
	database: pg_dbname,
	user: pg_user_name,
	password: pg_password,
	ssl: false,
	poolSize: 10
}

//MassiveJS loader settings
var loaderSettings = {}

//pg-promise settings passed through massive
var driverSettings = {
	promiseLib: Promise
}

module.exports = function(app) {
	return massive(conSettings, loaderSettings, driverSettings)
	.then((instance) => {
		logger.info('DBHOST: ', pg_host);
		logger.info('DBNAME: ', pg_dbname);
		app.set('db', instance);
		return instance;
	});
}

