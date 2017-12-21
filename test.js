const massive = require('massive');
const express = require('express');
const http = require('http');
const redis = require('redis');
const Promise = require('bluebird');

const app = express();

const db_host = process.env.TEST_DB_HOST;
const db_name = process.env.TEST_DB_NAME;
const db_user = process.env.TEST_USER;
const db_pass = process.env.TEST_PASSWORD;

const redis_host = process.env.REDIS_PORT_6379_TCP_ADDR || '127.0.0.1';

const conString = `postgres://${db_user}:${db_pass}@${db_host}/${db_name}`;
console.log('conString: ', conString);


Promise.promisifyAll(redis.RedisClient.prototype);
Promise.promisifyAll(redis.Multi.prototype);

/*
	http.createServer(app).listen(9999);
	app.get('/test', (req, res) => {
		console.log('route: /test');
		res.json({status: 'OK'});
	});

*/
var rClient;

function getClient() {
  return new Promise((resolve, reject) => {
    if (rClient) {
      console.log('Returning cached redis conn');
      return resolve(rClient);
    } else {
      console.log('Creating new redis conn using host: ', redis_host); 
      rClient = redis.createClient(6379, redis_host, {connect_timeout: 3000});

      rClient.on('connect', function() {
        console.log('Connected to redis!');
        return resolve(rClient);
      });

      rClient.on('error', function(err) {
        console.error('Could not connect to redis: ', err);
        return reject(err);
      });
    }
  });
}

massive(conString)
.then(db => {
	app.set('db', db);
	console.log('connected')

	app.get('/set', (req, res) => {
		console.log('route: /set');
		var now = Date.now();
		getClient()
		.then(rc => {
			return rc.setAsync('now', now);
		})
		.then(resp => {
			console.log(`redis setAsync for now to ${now} returned ${resp}`);
			res.json({status: 'OK', now: now});
		})
		.catch(err => {
			console.log('redis error: ', err);
			res.status(500).send(`error: ${err}`);
		})
	})

	app.get('/get', (req, res) => {
		console.log('route: /get');
		getClient()
		.then(rc => {
			return rc.getAsync('now');
		})
		.then(resp => {
			console.log(`redis getAsync for now returned ${resp}`);
			res.json({status: 'OK', now: resp});
		})
		.catch(err => {
			console.log('redis error: ', err);
			res.status(500).send('error: ', err);
		})
	})

	app.get('/', (req, res) => {
		console.log('route: /');
		req.app.get('db').query('select * from orgs')
		.then(results => {
			res.json(results);
		})
		.catch(err => {
			console.log('error running query: ', err.stack);
			res.status(500).send('error: ', err);
		})
	});

	http.createServer(app).listen(9999);

})
.catch(err => {
	console.log('db err: ', err);
})

