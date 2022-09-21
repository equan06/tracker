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

//note: req.params for route parameters, req.query for query params


/**
 * -GET return all activities
 * @param {*} request 
 * @param {*} response 
 */
function getActivities(request, response) {
    console.log('getActivities');
    
    let startDate = request.query.startDate;
    let endDate = request.query.endDate;
    console.log(request.query, startDate, endDate);

    // TODO: clean this up...
    let SQL = 'SELECT * FROM activities';
    let values = undefined;

    if (startDate != undefined && endDate != undefined) {
        SQL += ' WHERE date >= $1 AND date <= $2';
        values = [startDate, endDate];
    }
    else if (startDate != undefined) {
        SQL += ' WHERE date >= $1';
        values = [startDate];
    }
    else if (endDate != undefined) {
        SQL += ' WHERE date <= $2'
        values = [endDate];
    }

    SQL += ' ORDER BY id asc';
    console.log(SQL, values);

    pool.query(SQL, values, (error, results) => {
        if (error) {
            console.log(error);
            return response.sendStatus(400);
        }
        else {
            return response
                .status(200) // Send the status code
                .json(results.rows); // Send JSON as body
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
            response.status(201).json(results.rows[0].id);
        }
    );
}

/**
 * -DELETE an activity 
 * @param {*} request 
 * @param {*} response 
 */
function deleteActivityById(request, response) {
    console.log('delete');
    const id = parseInt(request.params.id);
    pool.query('DELETE FROM activities WHERE id = $1', [id], (error, results) => {
        if (error) {
            console.log(error);
            return response.sendStatus(400);
        }
        response.sendStatus(200); // with no body, use sendStatus instead of just send
    });
}

/**
 * -UPDATE an activity
 * @param {*} request 
 * @param {*} response 
 */
function updateActivityById(request, response) {
    console.log('put');
    const id = parseInt(request.params.id);
    const { name, date, miles, time, notes } = request.body;
    pool.query('UPDATE activities SET name = $2, date = $3, miles = $4, time = $5, notes = $6 WHERE id = $1',
        [id, name, date, miles, time, notes],
        (error, results) => {
            if (error) {
                console.log(error);
                return response.sendStatus(400);
            }
            response.sendStatus(200);
        }
    )
}


module.exports = {
    getActivities,
    getActivityById,
    createActivity,
    deleteActivityById,
    updateActivityById
}