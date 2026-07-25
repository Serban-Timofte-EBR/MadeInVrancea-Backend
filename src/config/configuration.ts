export interface AppConfig {
  nodeEnv: string;
  port: number;
  jwt: {
    secret: string;
    expiresIn: string;
  };
  database: {
    host: string;
    port: number;
    username: string;
    password: string;
    name: string;
    encrypt: boolean;
    trustServerCertificate: boolean;
    synchronize: boolean;
  };
  storage: {
    connectionString: string;
    containerName: string;
    publicUrl: string;
  };
  admin: {
    email: string;
    password: string;
  };
}

export default (): AppConfig => ({
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port: parseInt(process.env.PORT ?? '3000', 10),
  jwt: {
    secret: process.env.JWT_SECRET ?? 'change-me-in-production',
    expiresIn: process.env.JWT_EXPIRES_IN ?? '7d',
  },
  database: {
    host: process.env.DB_HOST ?? 'localhost',
    port: parseInt(process.env.DB_PORT ?? '1433', 10),
    username: process.env.DB_USERNAME ?? 'sa',
    password: process.env.DB_PASSWORD ?? 'Your_password123',
    name: process.env.DB_NAME ?? 'madeinvrancea',
    encrypt: (process.env.DB_ENCRYPT ?? 'true') === 'true',
    trustServerCertificate:
      (process.env.DB_TRUST_SERVER_CERT ?? 'true') === 'true',
    synchronize:
      (process.env.DB_SYNCHRONIZE ??
        (process.env.NODE_ENV !== 'production' ? 'true' : 'false')) === 'true',
  },
  storage: {
    connectionString: process.env.AZURE_STORAGE_CONNECTION_STRING ?? '',
    containerName: process.env.AZURE_STORAGE_CONTAINER ?? 'media',
    publicUrl: process.env.AZURE_STORAGE_PUBLIC_URL ?? '',
  },
  admin: {
    email: process.env.ADMIN_EMAIL ?? 'admin@madeinvrancea.ro',
    password: process.env.ADMIN_PASSWORD ?? 'Admin_password123',
  },
});
