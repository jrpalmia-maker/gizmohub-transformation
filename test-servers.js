import fetch from 'node-fetch';

async function testServers() {
  try {
    console.log('Testing Backend (port 5000)...');
    const backendRes = await fetch('http://localhost:5000/');
    const backendData = await backendRes.json();
    console.log('✓ Backend Response:', backendData);
  } catch (e) {
    console.error('✗ Backend Error:', e.message);
  }

  try {
    console.log('\nTesting Frontend (port 3000)...');
    const frontendRes = await fetch('http://localhost:3000/');
    console.log('✓ Frontend Status:', frontendRes.status);
  } catch (e) {
    console.error('✗ Frontend Error:', e.message);
  }
}

testServers();
