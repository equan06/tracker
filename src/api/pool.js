import { Pool, types } from 'pg';
// nice credentials
const config = {
    user: 'sa',
    host: 'localhost',
    database: 'run',
    password: 'password123',
    port: 5432 // default postgres port
};
const pool = new Pool(config);
types.setTypeParser(1114, (stringValue)=> {
    return stringValue.substring(0, 10);
});

export default pool;