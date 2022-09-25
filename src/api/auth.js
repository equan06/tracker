const { isCompositeComponent } = require("react-dom/test-utils");
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
            if (results.rows.count > 0 && results.rows[0].password === password) {
                return response.sendStatus(200);
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