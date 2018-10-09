const winston = require('winston');
const fs      = require('fs');
const logDir  = 'log';

const tsFormat = () => (new Date()).toLocaleTimeString();

const env = process.env.NODE_ENV;
console.log('>> including logger service.');

var verboseLevel = 'verbose';
var sillyLevel = 'silly';

if (env === 'production') {
  // only info level messages in production
  console.log('Logger configured for production');
  verboseLevel = 'info';
  sillyLevel = 'info';

  // build two different info level consoles: 1 for dev, 1 for prod
  //
  // configure info level console for prod
  transportInfo = new (winston.transports.Console)({
      name: 'info-console',
      colorize: false,
      timestamp: tsFormat,
      prettyPrint: true,
      level: 'info'
    });
} else {
  // configure info level console for dev
  console.log('Logger configured for dev');
  transportInfo = new (winston.transports.Console)({
      name: 'info-console',
      colorize: true,
      timestamp: tsFormat,
      prettyPrint: true,
      level: 'info'
    });
}

// Create the log directory if it does not exist
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

const transports = [

    // selects info console config based on NODE_ENV
    transportInfo,

    // info log file
    new (winston.transports.File)({
      name: 'info',
      filename: `${logDir}/unv-info.log`,
      json: false,                      // override default of logging in json objects
      timestamp: tsFormat,
      level: 'info',
      maxsize:'100000000', //100MB
      maxFiles:'10', //total 1GB, will delete oldest file
      tailable: true //unv-info.log always has the latest info
    }),

    // verbose log file
    new (winston.transports.File)({
      name: 'verbose',
      filename: `${logDir}/unv-verbose.log`,
      json: false,                      // override default of logging in json objects
      timestamp: tsFormat,
      level: verboseLevel,
      maxsize:'100000000', //100MB
      maxFiles:'10', //total 1GB, will delete oldest file
      tailable: true //unv-verbose.log always has the latest info
    }),

    // silly log file
    new (winston.transports.File)({
      name: 'silly',
      filename: `${logDir}/unv-silly.log`,
      json: false,                      // override default of logging in json objects
      timestamp: tsFormat,
      level: sillyLevel,
      maxsize:'100000000', //100MB
      maxFiles:'10', //total 1GB, will delete oldest file
      tailable: true //unv-silly.log always has the latest info
    })
];


var myCustomLevels = {
  levels: {
    error: 0,
    warn: 1,
    info: 2,
    verbose: 3,
    silly: 4
  },
  colors: {
    error: 'red',
    warn: 'yellow',
    info: 'green',
    verbose: 'blue',
    silly: 'purple'
  }
}

var logger = new (winston.Logger)({
  levels: myCustomLevels.levels,
  colors: myCustomLevels.colors,
  transports,
  exitOnError: false
});

logger.truncate = function(str, maxchars) {
  logger.info(str.substring(0, maxchars));
  logger.verbose(str);
}

module.exports = logger;
