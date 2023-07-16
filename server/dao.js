'use strict';

/** DB access module **/

const sqlite = require('sqlite3');

// open the database
exports.db = new sqlite.Database('Airplane.db', (err) => {
  if (err) throw err;
});


