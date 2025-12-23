import mysql from 'mysql2/promise';

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'gizmohub_db',
});

async function checkProduct() {
    try {
        const connection = await pool.getConnection();
        const [products] = await connection.query(
            'SELECT p.product_id, p.name, p.price, p.stock, b.name as brand, c.name as category FROM products p LEFT JOIN brands b ON p.brand_id = b.brand_id LEFT JOIN categories c ON p.category_id = c.category_id WHERE p.name LIKE "%Yoga%"'
        );
        console.log('✓ Lenovo Yoga Product Found:');
        console.table(products);
        
        // Get full details
        const [fullDetails] = await connection.query(
            'SELECT * FROM products WHERE name LIKE "%Yoga%"'
        );
        console.log('\n✓ Full Product Details:');
        console.log(JSON.stringify(fullDetails[0], null, 2));
        
        connection.release();
    } catch (error) {
        console.error('Error:', error.message);
    }
    process.exit(0);
}

checkProduct();
