
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: path.join(__dirname, '../.env') });

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL; // Backend often uses SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // MUST be service role for admin tasks

if (!supabaseUrl || !supabaseKey) {
    console.error('Error: Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
    console.error('Please ensure .env has these variables.');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function runMigration() {
    console.log('Starting Database Migration...');

    const sqlPath = path.join(__dirname, '../supabase_schema.sql');
    if (!fs.existsSync(sqlPath)) {
        console.error('Migration file not found:', sqlPath);
        process.exit(1);
    }

    const sql = fs.readFileSync(sqlPath, 'utf8');

    // Supabase JS doesn't support raw SQL execution easily unless via RPC or specific admin API if enabled.
    // However, fastify-postgres or direct pg connection is better for DDL.
    // CleanMeta uses `pg` (via `postgres` container) but user seems to use Managed Supabase?
    // User said "lot of data base ruunin in the vps".
    // If it's local postgres, we should use `pg` client.

    // Let's check config.
    // If REDIS_HOST is used, maybe DB is local too?
    // docker-compose.prod.yml has postgres services for other apps but NOT for CleanMeta (CleanMeta only has Redis).
    // This implies CleanMeta uses EXTERNAL Supabase (Cloud).

    // Executing raw SQL on Cloud Supabase via script is tricky without `postgres` connection string.
    // Supabase provides connection string in dashboard.
    // Assuming `DATABASE_URL` is available in .env (standard for Supabase).

    if (!process.env.DATABASE_URL) {
        console.log('DATABASE_URL not found. Attempting to use Supabase Query API (limited support)...');
        // Actually, without DATABASE_URL, we can't easily run DDL unless we have a helper function.
        // I will assume DATABASE_URL exists or instruct user.
        console.error('Please add DATABASE_URL to your .env to run migrations automatically.');
        process.exit(1);
    }

    const { Client } = require('pg');
    const client = new Client({
        connectionString: process.env.DATABASE_URL,
    });

    try {
        await client.connect();
        console.log('Connected to Database.');
        await client.query(sql);
        console.log('Migration executed successfully.');
        await client.end();
    } catch (err) {
        console.error('Migration failed:', err);
        process.exit(1);
    }
}

runMigration();
