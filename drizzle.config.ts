import { defineConfig } from 'drizzle-kit';

// Configuration file that is used by Drizzle Kit and contains all the information about :
// - your database connection,
// - migration folder and
// - schema files.
// Define and export the Drizzle Kit configuration for database schema and migrations
export default defineConfig({
    schema: './src/drizzle/schema.ts',              // Schemas to be used for migrations and generation
    out: './src/drizzle/migrations',                // Output directory for generated migration files
    dialect: 'postgresql',
    dbCredentials: {
        url: process.env.DATABASE_URL!,
    },
});
