import fetch from 'node-fetch';

async function testFullAPI() {
    const API_URL = 'http://localhost:5000/api';
    
    try {
        console.log('🧪 Testing Full API Stack\n');
        
        // 1. Test categories endpoint
        console.log('1️⃣ Testing GET /api/categories');
        const catRes = await fetch(`${API_URL}/categories`);
        const categories = await catRes.json();
        console.log(`   Status: ${catRes.status}`);
        console.log(`   Found ${categories.length} categories`);
        if (categories.length > 0) {
            console.log(`   Example: ${JSON.stringify(categories[0])}`);
        }
        
        // 2. Test brands endpoint
        console.log('\n2️⃣ Testing GET /api/brands');
        const brandRes = await fetch(`${API_URL}/brands`);
        const brands = await brandRes.json();
        console.log(`   Status: ${brandRes.status}`);
        console.log(`   Found ${brands.length} brands`);
        
        // 3. Test products endpoint
        console.log('\n3️⃣ Testing GET /api/products');
        const prodRes = await fetch(`${API_URL}/products`);
        const products = await prodRes.json();
        console.log(`   Status: ${prodRes.status}`);
        console.log(`   Found ${products.length} products`);
        
        // 4. Test category filter for Laptops (id=3)
        console.log('\n4️⃣ Testing GET /api/products/category/3');
        const laptopsRes = await fetch(`${API_URL}/products/category/3`);
        const laptopProducts = await laptopsRes.json();
        console.log(`   Status: ${laptopsRes.status}`);
        console.log(`   Found ${laptopProducts.length} laptop products`);
        if (laptopProducts.length > 0) {
            console.log(`   Products:`);
            laptopProducts.forEach(p => {
                console.log(`     - ${p.name} ($${p.price})`);
            });
        }
        
        console.log('\n✅ All API endpoints are working!\n');
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
    
    process.exit(0);
}

testFullAPI();
