const massive = require('massive');
const db_host = process.env.TEST_DB_HOST;
const db_name = process.env.TEST_DB_NAME;
const db_user = 'unevrse';
const db_pass = 'unevrse';

const conString = `postgres://${db_user}:${db_pass}@${db_host}/${db_name}`;
console.log('conString: ', conString);

massive(conString)
.then(db => {
	return db.query('select * from orgs')
})
.then(results => {
	console.log('query results: ', results);
})
.catch(err => {
	console.log('db err: ', err);
})
