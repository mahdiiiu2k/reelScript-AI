import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from "@shared/schema";

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Please configure your database connection string.",
  );
}

console.log('Connecting to PostgreSQL database...');

// Use DATABASE_URL directly without any modifications
const databaseUrl = process.env.DATABASE_URL;

const client = postgres(databaseUrl, { 
  prepare: false,
  max: 10,
  onnotice: () => {}, // Suppress notices
  transform: {
    undefined: null
  }
});

export const db = drizzle(client, { schema });

// Test connection with proper error handling
client`SELECT 1 as test`
  .then(() => console.log('✅ Successfully connected to PostgreSQL database'))
  .catch((err) => {
    console.error('❌ Database connection failed:', err.message);
    if (err.message.includes('ENOTFOUND')) {
      console.error('Please verify your DATABASE_URL hostname is correct');
    } else if (err.message.includes('authentication')) {
      console.error('Please verify your database password is correct');
    }
  });
