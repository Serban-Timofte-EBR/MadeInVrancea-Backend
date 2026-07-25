import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Business } from '../businesses/entities/business.entity';
import { MediaAsset } from './entities/media-asset.entity';
import { MediaController } from './media.controller';
import { MediaService } from './media.service';
import { BlobStorageService } from './storage/blob-storage.service';

@Module({
  imports: [TypeOrmModule.forFeature([MediaAsset, Business])],
  controllers: [MediaController],
  providers: [MediaService, BlobStorageService],
  exports: [MediaService],
})
export class MediaModule {}
