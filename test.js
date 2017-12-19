const massive = require('massive');
const express = require('express');
const http = require('http');

const app = express();

const db_host = process.env.TEST_DB_HOST;
const db_name = process.env.TEST_DB_NAME;
const db_user = process.env.TEST_USER;
const db_pass = process.env.TEST_PASSWORD;

const conString = `postgres://${db_user}:${db_pass}@${db_host}/${db_name}`;
console.log('conString: ', conString);

massive(conString)
.then(db => {
	app.set('db', db);

	app.get('/', (req, res) => {
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
