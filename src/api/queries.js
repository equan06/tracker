const Pool = require('pg').Pool;
const pool = new Pool({
    user: 'sa',
    host: 'localhost',
    database: 'run',
    password: 'password123',
    port: 5432 // default postgres port
})


/**
 * -GET return all activities
 * @param {*} request 
 * @param {*} response 
 */
function getActivities(request, response) {
    pool.query('SELECT * FROM activities ORDER BY id asc', (error, results) => {
        if (error) {
            throw error;
        }
        console.log(results);
        response.status(200).json(results.rows);
    })
}

/**
 * -GET/:id return an activity by id
 * @param {*} request 
 * @param {*} response 
 */
function getActivityById(request, response) {
    const id = parseInt(request.params.id);
    pool.query('SELECT * FROM activities WHERE id = $1', [id], (error, results) => {
        if (error) {
            throw error;
        }
        console.log(results);
        response.status(200).json(results.rows);
    })
}

/**
 * -POST create an activity, return the new id
 * @param {*} request 
 * @param {*} response 
 */
function createActivity(request, response) {
    const { name, date, miles, time, notes } = request.body;
    pool.query('INSERT INTO activities (name, date, miles, time, notes) VALUES ($1, $2, $3, $4, $5) RETURNING id', 
        [name, date, miles, time, notes],
        (error, results) => {
            if (error) {
                throw error;
            }
            console.log(results);
            response.status(201).json(results.rows[0].id);
        }
    )
}



module.exports = {
    getActivities,
    getActivityById,
    createActivity
}