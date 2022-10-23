const pg = require("./pool");
const pool = pg.pool;

function authUserEmail(request, response) {
    console.log(request.body);
    const { email, password } = request.body;
    pool.query("SELECT * FROM users WHERE email = $1", [email], (error, results) => {
        if (error) {
            console.log(error);
            return response.sendStatus(400);
        }
        else {
            console.log(results);
            // TODO: bcrypt
            if (results.rows.length > 0 && results.rows[0].password === password) {
                // return any information about the user
                // return response.status(200).json({ID: results.rows[0].ID, email: results.rows[0].email});
                return response.status(200).json({ID: results.rows[0].ID, email: results.rows[0].email });
            }
            else {
                return response.sendStatus(401);
            }
        }
    });
}
module.exports = {
    authUserEmail
};
