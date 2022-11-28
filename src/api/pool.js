import pg from 'pg';
// nice credentials
const config = {
    user: 'sa',
    host: 'localhost',
    database: 'run',
    password: 'password123',
    port: 5432 // default postgres port
};
const pool = new pg.Pool(config);
pg.types.setTypeParser(1114, (stringValue)=> {
    return stringValue.substring(0, 10);
});

export default pool;