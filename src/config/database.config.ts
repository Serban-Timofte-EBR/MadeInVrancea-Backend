import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

/**
 * Builds the TypeORM connection options for SQL Server.
 *
 * The same configuration works for a local SQL Server instance (Docker) during
 * development and for Azure SQL Database (Basic tier) in production. Only the
 * environment variables change between the two environments.
 */
export const buildDatabaseConfig = (
  config: ConfigService,
): TypeOrmModuleOptions => ({
  type: 'mssql',
  host: config.get<string>('database.host'),
  port: config.get<number>('database.port'),
  username: config.get<string>('database.username'),
  password: config.get<string>('database.password'),
  database: config.get<string>('database.name'),
  autoLoadEntities: true,
  synchronize: config.get<boolean>('database.synchronize'),
  options: {
    encrypt: config.get<boolean>('database.encrypt'),
    trustServerCertificate: config.get<boolean>(
      'database.trustServerCertificate',
    ),
  },
  extra: {
    // Keep the connection pool small so the Basic tier DTU limit is respected.
    pool: {
      max: 5,
      min: 0,
      idleTimeoutMillis: 30000,
    },
  },
});
