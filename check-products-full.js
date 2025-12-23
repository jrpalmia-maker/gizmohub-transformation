import mysql from 'mysql2/promise';

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'gizmohub_db',
});

async function checkProducts() {
    try {
        const connection = await pool.getConnection();
        
        // Check all products
        console.log('\n📦 ALL PRODUCTS:');
        const [allProducts] = await connection.query(
            'SELECT p.product_id, p.name, p.price, p.stock, b.name as brand, c.name as category FROM products p LEFT JOIN brands b ON p.brand_id = b.brand_id LEFT JOIN categories c ON p.category_id = c.category_id'
        );
        console.table(allProducts);
        
        // Check Lenovo Yoga product specifically
        console.log('\n🔍 LENOVO YOGA PRODUCT DETAILS:');
        const [yogaProduct] = await connection.query(
            'SELECT * FROM products WHERE name LIKE "%Yoga%"'
        );
        
        if (yogaProduct.length > 0) {
            console.log('Product found:');
            const product = yogaProduct[0];
            console.log('- ID:', product.product_id);
            console.log('- Name:', product.name);
            console.log('- Price:', product.price);
            console.log('- Stock:', product.stock);
            console.log('- Category ID:', product.category_id);
            console.log('- Brand ID:', product.brand_id);
            console.log('- Description:', product.description ? product.description.substring(0, 100) + '...' : 'NULL');
            console.log('- Specification:', product.specification ? product.specification.substring(0, 100) + '...' : 'NULL');
            console.log('- Reasons to Buy:', product.reasons_to_buy);
            console.log('- Reasons to Avoid:', product.reasons_to_avoid);
        } else {
            console.log('❌ Lenovo Yoga product NOT found');
        }
        
        // Check categories
        console.log('\n📂 CATEGORIES:');
        const [categories] = await connection.query('SELECT * FROM categories');
        console.table(categories);
        
        // Check brands
        console.log('\n🏷️ BRANDS:');
        const [brands] = await connection.query('SELECT * FROM brands');
        console.table(brands);
        
        connection.release();
    } catch (error) {
        console.error('Error:', error.message);
        console.error('Full error:', error);
    }
    process.exit(0);
}

checkProducts();
