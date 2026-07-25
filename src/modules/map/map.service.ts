import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BusinessStatus } from '../../common/enums/business-status.enum';
import { MediaType } from '../../common/enums/media-type.enum';
import { Location } from '../locations/entities/location.entity';
import { MapPinDto } from './dto/map-pin.dto';
import { MapQueryDto } from './dto/map-query.dto';

@Injectable()
export class MapService {
  constructor(
    @InjectRepository(Location)
    private readonly locationsRepository: Repository<Location>,
  ) {}

  async getPins(query: MapQueryDto): Promise<MapPinDto[]> {
    const qb = this.locationsRepository
      .createQueryBuilder('l')
      .innerJoinAndSelect('l.business', 'b')
      .leftJoinAndSelect('b.categories', 'c')
      .leftJoinAndSelect('b.media', 'm')
      .where('b.status = :status', { status: BusinessStatus.ACTIVE });

    if (query.minLat !== undefined && query.maxLat !== undefined) {
      qb.andWhere('l.latitude BETWEEN :minLat AND :maxLat', {
        minLat: query.minLat,
        maxLat: query.maxLat,
      });
    }

    if (query.minLng !== undefined && query.maxLng !== undefined) {
      qb.andWhere('l.longitude BETWEEN :minLng AND :maxLng', {
        minLng: query.minLng,
        maxLng: query.maxLng,
      });
    }

    if (query.search) {
      qb.andWhere('b.name LIKE :search', { search: `%${query.search}%` });
    }

    if (query.categoryId) {
      qb.andWhere(
        (sub) =>
          'b.businessId IN ' +
          sub
            .subQuery()
            .select('bc.businessId')
            .from('business_categories', 'bc')
            .where('bc.categoryId = :categoryId')
            .getQuery(),
      ).setParameter('categoryId', query.categoryId);
    }

    const locations = await qb.getMany();
    return locations.map((location) => this.toPin(location));
  }

  private toPin(location: Location): MapPinDto {
    const business = location.business;
    const primaryCategory = business.categories?.[0];
    const logo = business.media?.find(
      (asset) => asset.entityType === MediaType.LOGO,
    );

    return {
      locationId: location.locationId,
      businessId: business.businessId,
      name: business.name,
      slug: business.slug,
      latitude: location.latitude,
      longitude: location.longitude,
      address: location.address,
      city: location.city,
      category: primaryCategory
        ? {
            name: primaryCategory.name,
            slug: primaryCategory.slug,
            iconURL: primaryCategory.iconURL,
          }
        : null,
      logoUrl: logo?.fileURL ?? null,
    };
  }
}
