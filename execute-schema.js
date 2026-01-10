import fs from 'fs';
import { Pool } from 'pg';

// Connect to PostgreSQL using DATABASE_URL from Railway
const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

async function executeSchema() {
    try {
        console.log('Connecting to PostgreSQL...');
        const client = await pool.connect();
        console.log('✓ Connected successfully');

        // Read the SQL file
        const sqlFile = fs.readFileSync('./init-postgres.sql', 'utf8');
        
        // Split by semicolon and filter empty statements
        const statements = sqlFile
            .split(';')
            .map(stmt => stmt.trim())
            .filter(stmt => stmt.length > 0);

        console.log(`\nExecuting ${statements.length} SQL statements...\n`);

        // Execute each statement
        for (let i = 0; i < statements.length; i++) {
            try {
                await client.query(statements[i]);
                console.log(`✓ Statement ${i + 1}/${statements.length} executed`);
            } catch (err) {
                console.error(`✗ Statement ${i + 1}/${statements.length} failed:`, err.message);
                // Continue with other statements
            }
        }

        client.release();
        console.log('\n✓ Schema initialization complete!');
        console.log('You can now try signing up at gizmohub-transformation.up.railway.app');
        
    } catch (err) {
        console.error('Error:', err.message);
        process.exit(1);
    } finally {
        await pool.end();
    }
}

executeSchema();
