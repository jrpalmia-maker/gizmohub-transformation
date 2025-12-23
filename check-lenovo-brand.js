import mysql from 'mysql2/promise';

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'gizmohub_db',
});

async function checkBrand() {
    try {
        const connection = await pool.getConnection();
        const [brands] = await connection.query('SELECT brand_id, name FROM brands WHERE name = ?', ['Lenovo']);
        
        if (brands.length > 0) {
            console.log('✓ Lenovo brand found:');
            console.table(brands);
        } else {
            console.log('✗ Lenovo brand not found');
        }
        
        connection.release();
    } catch (error) {
        console.error('Error:', error.message);
    }
    process.exit(0);
}

checkBrand();
