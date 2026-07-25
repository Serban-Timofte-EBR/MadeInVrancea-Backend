import { BlobServiceClient, ContainerClient } from '@azure/storage-blob';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'crypto';
import { promises as fs } from 'fs';
import { dirname, extname, join } from 'path';

export interface StoredFile {
  url: string;
  blobName: string;
}

/**
 * Persists uploaded media either to Azure Blob Storage (production, or locally
 * via the Azurite emulator) or to the local `./uploads` folder when no storage
 * connection string is configured. This keeps local development friction-free
 * while matching the Phase 1 infrastructure (Azure Blob Storage).
 */
@Injectable()
export class BlobStorageService implements OnModuleInit {
  private readonly logger = new Logger(BlobStorageService.name);
  private containerClient?: ContainerClient;

  private readonly connectionString: string;
  private readonly containerName: string;
  private readonly publicUrl: string;
  private readonly localDir = join(process.cwd(), 'uploads');

  constructor(private readonly config: ConfigService) {
    this.connectionString =
      this.config.get<string>('storage.connectionString') ?? '';
    this.containerName =
      this.config.get<string>('storage.containerName') ?? 'media';
    this.publicUrl = this.config.get<string>('storage.publicUrl') ?? '';
  }

  async onModuleInit(): Promise<void> {
    if (!this.connectionString) {
      await fs.mkdir(this.localDir, { recursive: true });
      this.logger.warn(
        'AZURE_STORAGE_CONNECTION_STRING not set — storing uploads on local disk (./uploads)',
      );
      return;
    }

    try {
      const client = BlobServiceClient.fromConnectionString(
        this.connectionString,
      );
      this.containerClient = client.getContainerClient(this.containerName);
      try {
        await this.containerClient.createIfNotExists({ access: 'blob' });
      } catch {
        // Public access may be disabled on the account; create a private container.
        await this.containerClient.createIfNotExists();
      }
      this.logger.log(
        `Using Azure Blob Storage container '${this.containerName}'`,
      );
    } catch (error) {
      this.containerClient = undefined;
      await fs.mkdir(this.localDir, { recursive: true });
      this.logger.error(
        'Failed to initialize Azure Blob Storage — falling back to local disk',
        error as Error,
      );
    }
  }

  async upload(file: Express.Multer.File, folder: string): Promise<StoredFile> {
    const blobName = `${folder}/${randomUUID()}${extname(file.originalname)}`;

    if (this.containerClient) {
      const blockBlob = this.containerClient.getBlockBlobClient(blobName);
      await blockBlob.uploadData(file.buffer, {
        blobHTTPHeaders: { blobContentType: file.mimetype },
      });
      const url = this.publicUrl
        ? `${this.publicUrl.replace(/\/$/, '')}/${blobName}`
        : blockBlob.url;
      return { url, blobName };
    }

    const target = join(this.localDir, blobName);
    await fs.mkdir(dirname(target), { recursive: true });
    await fs.writeFile(target, file.buffer);
    return { url: `/uploads/${blobName}`, blobName };
  }

  async delete(blobName: string): Promise<void> {
    if (!blobName) {
      return;
    }

    if (this.containerClient) {
      await this.containerClient.deleteBlob(blobName).catch(() => undefined);
      return;
    }

    await fs.unlink(join(this.localDir, blobName)).catch(() => undefined);
  }
}
