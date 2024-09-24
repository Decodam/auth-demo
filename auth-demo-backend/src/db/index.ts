
import { drizzle } from 'drizzle-orm/d1';
import * as schema from './schema';
import { D1Database } from '@cloudflare/workers-types'; // Import D1Database type

export const initDbConnect = (env: D1Database) => drizzle(env, { schema });
