import bcrypt from "bcrypt";
import pool from "./pool";

export const saltRounds = 10;

function getUserById(request, response) {
    const id = parseFloat(request.params.id);
    pool.query("SELECT * FROM users WHERE id = $1", [id], (error, results) => {
        if (error) {
            console.log(error);
            return response.sendStatus(400);
        }
        response.status(200).json(results.rows);
    });
}


async function createUser(request, response) {
    const { username, password } = request;
    bcrypt.hash(password, saltRounds)
        .then(async (hash) => {
            try {
                let results = await pool.query("INSERT INTO users (username, password) VALUES ($1, $2)", [username, hash]);
                response.sendStatus(200);
            }
            catch (err) {
                console.error(err);
                response.sendStatus(400);
            }
        });
}

module.export = {
    getUserById,
    createUser
};