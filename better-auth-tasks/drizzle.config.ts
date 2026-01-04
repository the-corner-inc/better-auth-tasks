import { defineConfig } from 'drizzle-kit';

// Define and export the Drizzle Kit configuration for database schema generation and migrations
// We define : The schema file, output directory for migrations, database dialect, and connection credentials
export default defineConfig({
    schema: './src/drizzle/schema.ts',              // Schemas to be used for migrations and generation
    out: './src/drizzle/migrations',                // Output directory for generated migration files
    dialect: 'postgresql',
    dbCredentials: {
        url: process.env.DATABASE_URL!,
    },
});
