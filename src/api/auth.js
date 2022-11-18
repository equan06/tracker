import pool from "./pool";
import { v4 } from "uuid";
import bcrypt from "bcrypt";

const expireHrs = 1; 

async function authUser(request, response) {
    const { email, password } = request.body;
    let client = await pool.connect();

    try {
        let results = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
        if (results.rowCount > 0) {
            let isAuth = await bcrypt.compare(password, results[0].hash);
            if (isAuth)
            {
                let session_id = await createSession(client, results.rows[0].id);
                console.log("authenticated", session_id);
                response.cookie("sid", session_id, { httpOnly: false, maxAge: expireHrs * 60 * 60 * 1000 });
                return response.sendStatus(200);
            }
        }
        return response.sendStatus(401); // Bad authentication
    }
    catch (e) {
        console.error("Error in authUser", e.stack);
        return response.sendStatus(400);
    }
    finally {
        client.release();
    }
}


async function createSession(client, user_id) {
    // This runs in a transaction, client should be defined
    let session_id = v4();
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
}

Date.prototype.addHours = function(h) {
    this.setTime(this.getTime() + h*60*60*1000);
    return this;
}

export default {
    authUser
};
