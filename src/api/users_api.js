const pg = require("./pool");
const pool = pg.pool;

function getUserById(request, response) {
    const id = parseFloat(request.params.id);
    pool.query('SELECT * FROM users WHERE id = $1', [id], (error, results) => {
        if (error) {
            console.log(error);
            return response.sendStatus(400);
        }
        response.status(200).json(results.rows);
    });
}

module.export = {
    getUserById
};