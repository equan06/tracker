const pg = require('pg');
const Pool = pg.Pool;
const pool = new Pool({
    user: 'sa',
    host: 'localhost',
    database: 'run',
    password: 'password123',
    port: 5432 // default postgres port
});
const types = pg.types;
types.setTypeParser(1114, (stringValue)=> {
    return stringValue.substring(0, 10);
});

module.exports = {
    pool
};