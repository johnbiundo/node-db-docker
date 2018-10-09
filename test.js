'use strict';

const APPVERSION = '1.1';
const APPNAME = 'NODE-DB-DOCKER';

//
// node-db-manager - copyright(c) Unevrse, Inc. 2016, 2017
//
//
const express 					= require('express');
const Promise 					= require('bluebird');
const bodyParser 				= require('body-parser');
const cookieParser 			= require('cookie-parser');
const logger 						= require('./services/LoggerService.js');
const morgan 						= require('morgan');

const app = express();

require('dotenv').config();

app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true, parameterLimit: 50000}));
app.use(cookieParser());
app.use(morgan('dev'));

// Set trust proxy - see: https://expressjs.com/en/guide/behind-proxies.html
app.set('trust proxy', 'loopback');

var server = require('http').createServer(app);

require('./routes')(app);

const DEFAULT_APP_SERVICE_PORT = 5991;
const APP_SERVICE_PORT = process.env.APP_SERVICE_PORT || DEFAULT_APP_SERVICE_PORT;
var dbmgr;

require('./services/connectMassive.js')(app)
.then((db) => {
	dbmgr = db;
});

logger.info(`${APPNAME} v ${APPVERSION} Starting...\n`);

server.listen(APP_SERVICE_PORT, function() {
  logger.info(`${APPNAME} running on port: `, APP_SERVICE_PORT);
});
