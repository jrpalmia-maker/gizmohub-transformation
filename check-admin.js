import mysql from 'mysql2/promise';

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'gizmohub_db',
});

async function checkAdmin() {
    try {
        const connection = await pool.getConnection();
        const [admins] = await connection.query('SELECT * FROM admins');
        console.log('Admin records in database:');
        console.table(admins);
        connection.release();
    } catch (error) {
        console.error('Error:', error.message);
    }
    process.exit(0);
}

checkAdmin();
