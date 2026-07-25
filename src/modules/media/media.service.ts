import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MediaType } from '../../common/enums/media-type.enum';
import { assertOwnerOrAdmin } from '../../common/utils/ownership';
import { Business } from '../businesses/entities/business.entity';
import { User } from '../users/entities/user.entity';
import { MediaAsset } from './entities/media-asset.entity';
import { BlobStorageService } from './storage/blob-storage.service';

@Injectable()
export class MediaService {
  constructor(
    @InjectRepository(MediaAsset)
    private readonly mediaRepository: Repository<MediaAsset>,
    @InjectRepository(Business)
    private readonly businessRepository: Repository<Business>,
    private readonly storage: BlobStorageService,
  ) {}

  findByBusiness(businessId: string): Promise<MediaAsset[]> {
    return this.mediaRepository.find({
      where: { businessId },
      order: { uploadDate: 'ASC' },
    });
  }

  async upload(
    businessId: string,
    user: User,
    file: Express.Multer.File,
    type: MediaType,
  ): Promise<MediaAsset> {
    if (!file) {
      throw new BadRequestException('A file is required');
    }

    const business = await this.getOwnedBusiness(businessId, user);
    const stored = await this.storage.upload(file, business.businessId);

    // A business has a single Logo and a single Cover: replace the previous one.
    if (type === MediaType.LOGO || type === MediaType.COVER) {
      const existing = await this.mediaRepository.find({
        where: { businessId, entityType: type },
      });
      for (const asset of existing) {
        await this.storage.delete(asset.blobName ?? '');
      }
      if (existing.length > 0) {
        await this.mediaRepository.remove(existing);
      }
    }

    const media = this.mediaRepository.create({
      businessId,
      entityType: type,
      fileURL: stored.url,
      blobName: stored.blobName,
    });
    return this.mediaRepository.save(media);
  }

  async remove(mediaId: string, user: User): Promise<void> {
    const media = await this.mediaRepository.findOne({
      where: { mediaId },
      relations: { business: true },
    });
    if (!media) {
      throw new NotFoundException(`Media ${mediaId} not found`);
    }

    assertOwnerOrAdmin(media.business.ownerId, user);
    await this.storage.delete(media.blobName ?? '');
    await this.mediaRepository.remove(media);
  }

  private async getOwnedBusiness(
    businessId: string,
    user: User,
  ): Promise<Business> {
    const business = await this.businessRepository.findOne({
      where: { businessId },
    });
    if (!business) {
      throw new NotFoundException(`Business ${businessId} not found`);
    }
    assertOwnerOrAdmin(business.ownerId, user);
    return business;
  }
}
