import * as sql from 'mssql';

/**
 * Ensures the target database exists before TypeORM connects.
 *
 * SQL Server (unlike Postgres/MySQL setups) will not create the database
 * implicitly, so during local development we connect to `master` and create it
 * on demand. This is intentionally skipped in production, where the Azure SQL
 * database is provisioned once through the portal / IaC.
 */
export async function ensureDatabaseExists(): Promise<void> {
  const database = process.env.DB_NAME ?? 'madeinvrancea';

  // Guard against identifier injection — the name comes from configuration only.
  if (!/^[A-Za-z0-9_]+$/.test(database)) {
    throw new Error(`Invalid DB_NAME '${database}'`);
  }

  const config: sql.config = {
    server: process.env.DB_HOST ?? 'localhost',
    port: parseInt(process.env.DB_PORT ?? '1433', 10),
    user: process.env.DB_USERNAME ?? 'sa',
    password: process.env.DB_PASSWORD ?? '',
    database: 'master',
    options: {
      encrypt: (process.env.DB_ENCRYPT ?? 'true') === 'true',
      trustServerCertificate:
        (process.env.DB_TRUST_SERVER_CERT ?? 'true') === 'true',
    },
  };

  const pool = await new sql.ConnectionPool(config).connect();
  try {
    await pool
      .request()
      .query(`IF DB_ID('${database}') IS NULL CREATE DATABASE [${database}]`);
  } finally {
    await pool.close();
  }
}
