const Pool = require('pg').Pool;
const pool = new Pool({
    user: 'sa',
    host: 'localhost',
    database: 'run',
    password: 'password123',
    port: 5432 // default postgres port
})


function getActivities(request, response) {
    pool.query('SELECT * FROM activities ORDER BY id asc', (error, results) => {
        if (error) {
            throw error;
        }
        console.log(results);
        response.status(200).json(results.rows);
    })
}

module.exports = {
    getActivities
}