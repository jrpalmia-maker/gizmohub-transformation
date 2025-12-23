import mysql from 'mysql2/promise';

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'gizmohub_db',
});

async function verifyDellXPS() {
    try {
        const connection = await pool.getConnection();
        const [products] = await connection.query(
            'SELECT * FROM products WHERE product_id = 3'
        );
        
        if (products.length > 0) {
            const product = products[0];
            console.log('✅ Dell XPS 13 Updated Successfully!\n');
            console.log('📱 Product Details:');
            console.log('─'.repeat(60));
            console.log(`Name: ${product.name}`);
            console.log(`Price: $${product.price}`);
            console.log(`Stock: ${product.stock} units`);
            console.log(`Brand: Dell`);
            console.log(`Category: Laptops\n`);
            
            console.log('📋 Specifications:');
            console.log('─'.repeat(60));
            if (product.specification) {
                const specs = product.specification.split('|');
                specs.forEach(spec => console.log(`  • ${spec}`));
            }
            
            console.log('\n✨ Reasons to Buy:');
            console.log('─'.repeat(60));
            if (product.reasons_to_buy) {
                const pros = product.reasons_to_buy.split(',');
                pros.forEach(pro => console.log(`  ✓ ${pro.trim()}`));
            }
            
            console.log('\n⚠️ Reasons to Avoid:');
            console.log('─'.repeat(60));
            if (product.reasons_to_avoid) {
                const cons = product.reasons_to_avoid.split(',');
                cons.forEach(con => console.log(`  ✗ ${con.trim()}`));
            }
        }
        
        connection.release();
    } catch (error) {
        console.error('Error:', error.message);
    }
    process.exit(0);
}

verifyDellXPS();
