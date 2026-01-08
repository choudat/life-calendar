import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

// This will be used in Server Actions
const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle(sql, { schema });
