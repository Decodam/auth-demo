// drizzle.config.ts

import { defineConfig } from 'drizzle-kit';
import fs from 'fs';
import path from 'path';

function getLocalD1DB() {
	try {
		const basePath = path.resolve('.wrangler');
		const dbFile = fs
			.readdirSync(basePath, { encoding: 'utf-8', recursive: true })
			.find((f) => f.endsWith('.sqlite'));

		if (!dbFile) {
			throw new Error(`.sqlite file not found in ${basePath}`);
		}

		const url = path.resolve(basePath, dbFile);
		return url;
	} catch (err:any) {
		console.log(`Error  ${err.message}`);
	}
}

export default defineConfig({
	dialect: 'sqlite',
	schema: './src/db/schema.ts',
	out: './drizzle',
	...(process.env.NODE_ENV === 'production'
		? {
				driver: 'd1-http',
				dbCredentials: {
					accountId: process.env.CLOUDFLARE_D1_ACCOUNT_ID,
					databaseId: '15441b48-dada-4d51-bcfa-595d358e0366',
					token: process.env.CLOUDFLARE_D1_API_TOKEN
				}
			}
		: {
				dbCredentials: {
					url: getLocalD1DB()
				}
			})
});