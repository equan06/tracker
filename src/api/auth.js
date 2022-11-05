const pg = require("./pool");
const pool = pg.pool;
const uuid = require("uuid");
const expireHrs = 1; 


function authUser(request, response) {
    console.log(request.body);
    const { email, password } = request.body;
    pool.query("SELECT * FROM users WHERE email = $1", [email], async (error, results) => {
        if (error) {
            console.log(error);
            return response.sendStatus(400);
        }
        else {
            console.log(results);
            // TODO: bcrypt
            if (results.rows.length > 0 && results.rows[0].password === password) {
                // return any information about the user
                let session_id = await createSession(results.rows[0].id);
                response.cookie("sid", session_id, { httpOnly: false, maxAge: expireHrs * 60 * 60 * 1000 });
                // Create a session object                
                return response.sendStatus(200);
            }
            else {
                return response.sendStatus(401); // Unauthorized
            }
        }
    });
}


async function createSession(user_id) {
    // This runs in a transaction, so we establish client instead of the connection pool
    let session_id = uuid.v4();
    let client = await pool.connect();
    try {
        await client.query("BEGIN");
        let clearSessions = "DELETE FROM sessions WHERE user_id = $1";
        await pool.query(clearSessions, [user_id]);

        let expire_date = Date.now().addHours(expireHrs);
        let insertSession = "INSERT INTO sessions (id, user_id, expire_date) VALUES ($1, $2, $3)";
        await pool.query(insertSession, [session_id, user_id, expire_date]);
        await client.query("COMMIT");
    } 
    catch (e) {
        await client.query("ROLLBACK");
        throw e;
    } 
    finally {
        client.release();
        return session_id;
    }
}

Date.prototype.addHours = function(h) {
    this.setTime(thus.getTime() + h*60*60*1000);
    return this;
}
  

module.exports = {
    authUser
};
