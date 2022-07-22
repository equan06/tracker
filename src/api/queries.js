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
types.setTypeParser(1114, (stringValue)=>{
    return stringValue.substring(0, 10);
})

/**
 * -GET return all activities
 * @param {*} request 
 * @param {*} response 
 */
function getActivities(request, response) {
    console.log('getActivities');
    pool.query('SELECT * FROM activities ORDER BY id asc', (error, results) => {
        if (error) {
            console.log(error);
            return response.sendStatus(400);
        }
        else {
            console.log(results);
            response.status(200).json(results.rows);
        }
    });
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
            console.log(error);
            return response.sendStatus(400);
        }
        console.log(results);
        response.status(200).json(results.rows);
    });
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
                console.log(error);
                return response.sendStatus(400);
            }
            console.log(results);
            response.status(201).json(results.rows[0].id);
        }
    );
}



module.exports = {
    getActivities,
    getActivityById,
    createActivity
}