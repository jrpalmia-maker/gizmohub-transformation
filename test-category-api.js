import fetch from 'node-fetch';

const API_URL = 'http://localhost:5000/api';

async function testCategoryAPI() {
    try {
        console.log('🔍 Testing Category API...\n');
        
        // Get all categories
        console.log('1. Fetching all categories...');
        const catRes = await fetch(`${API_URL}/categories`);
        const categories = await catRes.json();
        console.log('Categories:', categories);
        
        // Try Laptops category
        const laptopsCategory = categories.find(c => c.name === 'Laptops');
        if (!laptopsCategory) {
            console.error('❌ Laptops category not found!');
            process.exit(1);
        }
        
        console.log(`\n2. Fetching products for Laptops (category_id: ${laptopsCategory.category_id})...`);
        const productsRes = await fetch(`${API_URL}/products/category/${laptopsCategory.category_id}`);
        console.log('Status:', productsRes.status);
        
        if (!productsRes.ok) {
            const error = await productsRes.text();
            console.error('Error response:', error);
        } else {
            const products = await productsRes.json();
            console.log('Products found:', products.length);
            console.table(products.map(p => ({
                id: p.product_id,
                name: p.name,
                category_name: p.category_name,
                brand_name: p.brand_name,
                price: p.price
            })));
        }
        
    } catch (error) {
        console.error('Test error:', error);
    }
    process.exit(0);
}

testCategoryAPI();
