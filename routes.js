/**
 * Main application routes
 */

'use strict';

module.exports = function(app) {

  app.get('/things', function(req, res) { res.json({'thing1': 'first thing', 'thing2': 'second thing'})});

  app.use('/api', require('./api/router.js'));
}
