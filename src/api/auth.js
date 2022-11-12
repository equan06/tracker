const pg = require("./pool");
const pool = pg.pool;
const uuid = require("uuid");
const expireHrs = 1; 


async function authUser(request, response) {
    const { email, password } = request.body;
    let client = await pool.connect();

    try {
        let results = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
        if (results.rowCount > 0 && results.rows[0].password === password) {
            let session_id = await createSession(client, results.rows[0].id);
            console.log("authenticated", session_id);
            response.cookie("sid", session_id, { httpOnly: false, maxAge: expireHrs * 60 * 60 * 1000 });
            return response.sendStatus(200);
        }
        else {
            return response.sendStatus(401); // Unauthorized
        }
    }
    catch (e) {
        console.error("Error in authUser", e.stack);
        return response.sendStatus(400);
    }
    finally {
        client.release();
    }

    // pool.query("SELECT * FROM users WHERE email = $1", [email], async (error, results) => {
    //     if (error) {
    //         console.log(error);
    //         return response.sendStatus(400);
    //     }
    //     else {
    //         console.log(results);
    //         // TODO: bcrypt
    //         if (results.rows.length > 0 && results.rows[0].password === password) {
    //             // return any information about the user
    //             let session_id = await createSession(results.rows[0].id);
    //             response.cookie("sid", session_id, { httpOnly: false, maxAge: expireHrs * 60 * 60 * 1000 });
    //             // Create a session object                
    //             return response.sendStatus(200);
    //         }
    //         else {
    //             return response.sendStatus(401); // Unauthorized
    //         }
    //     }
    // });
}


async function createSession(client, user_id) {
    // This runs in a transaction, so we establish client instead of the connection pool
    let session_id = uuid.v4();
    // let client = await pool.connect();
    try {
        await client.query("BEGIN");
        let clearSessions = "DELETE FROM sessions WHERE user_id = $1";
        await client.query(clearSessions, [user_id]);

        let expire_date = new Date().addHours(expireHrs);
        let insertSession = "INSERT INTO sessions (id, user_id, expire_date) VALUES ($1, $2, $3)";
        await client.query(insertSession, [session_id, user_id, expire_date]);
        await client.query("COMMIT");
        return session_id;
    } 
    catch (e) {
        await client.query("ROLLBACK");
        throw e;
    } 
    finally {
        // client.release();
    }
}

Date.prototype.addHours = function(h) {
    this.setTime(this.getTime() + h*60*60*1000);
    return this;
}
  

module.exports = {
    authUser
};
