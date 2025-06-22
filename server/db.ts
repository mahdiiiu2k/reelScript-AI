import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from "@shared/schema";

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Please configure your Supabase database connection string.",
  );
}

console.log('Connecting to Supabase PostgreSQL database...');

// Create postgres client optimized for Supabase
// Handle URL encoding for special characters in password
let databaseUrl = process.env.DATABASE_URL;

// For Supabase, construct the correct database URL using the scriptExpert hostname
if (process.env.SUPABASE_URL && databaseUrl.includes('supabase.co')) {
  // Use the correct Supabase database hostname for scriptExpert project
  const urlParts = databaseUrl.match(/postgresql:\/\/([^:]+):([^@]+)@(.+)/);
  if (urlParts) {
    const [, username, password, rest] = urlParts;
    const encodedPassword = encodeURIComponent(password);
    // Use the correct hostname: db.scriptexpert.supabase.co
    const correctedHost = `db.scriptexpert.supabase.co:5432/postgres`;
    databaseUrl = `postgresql://${username}:${encodedPassword}@${correctedHost}`;
    console.log('Using Supabase database connection for scriptExpert');
  }
} else if (databaseUrl.includes('supabase.co') && databaseUrl.includes('?')) {
  console.warn('Encoding special characters in DATABASE_URL...');
  // Extract password and encode it
  const urlParts = databaseUrl.match(/postgresql:\/\/([^:]+):([^@]+)@(.+)/);
  if (urlParts) {
    const [, username, password, rest] = urlParts;
    const encodedPassword = encodeURIComponent(password);
    databaseUrl = `postgresql://${username}:${encodedPassword}@${rest}`;
  }
}

const client = postgres(databaseUrl, { 
  prepare: false,
  max: 10,
  ssl: 'require',
  connection: {
    options: `--application_name=script-generator-app`
  },
  onnotice: () => {}, // Suppress notices
  transform: {
    undefined: null
  }
});

export const db = drizzle(client, { schema });

// Test connection with proper error handling
client`SELECT 1 as test`
  .then(() => console.log('✅ Successfully connected to Supabase database'))
  .catch((err) => {
    console.error('❌ Database connection failed:', err.message);
    if (err.message.includes('ENOTFOUND')) {
      console.error('Please verify your DATABASE_URL hostname is correct');
    } else if (err.message.includes('authentication')) {
      console.error('Please verify your database password is correct');
    }
  });
