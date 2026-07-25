import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { assertOwnerOrAdmin } from '../../common/utils/ownership';
import { Business } from '../businesses/entities/business.entity';
import { User } from '../users/entities/user.entity';
import { CreateLocationDto } from './dto/create-location.dto';
import { OperatingHourDto } from './dto/operating-hour.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { Location } from './entities/location.entity';
import { OperatingHour } from './entities/operating-hour.entity';

@Injectable()
export class LocationsService {
  constructor(
    @InjectRepository(Location)
    private readonly locationsRepository: Repository<Location>,
    @InjectRepository(OperatingHour)
    private readonly hoursRepository: Repository<OperatingHour>,
    @InjectRepository(Business)
    private readonly businessRepository: Repository<Business>,
  ) {}

  findByBusiness(businessId: string): Promise<Location[]> {
    return this.locationsRepository.find({
      where: { businessId },
      relations: { operatingHours: true },
    });
  }

  async findOne(locationId: string): Promise<Location> {
    const location = await this.locationsRepository.findOne({
      where: { locationId },
      relations: { operatingHours: true },
    });
    if (!location) {
      throw new NotFoundException(`Location ${locationId} not found`);
    }
    return location;
  }

  async create(
    businessId: string,
    user: User,
    dto: CreateLocationDto,
  ): Promise<Location> {
    await this.assertBusinessAccess(businessId, user);

    if (dto.isPrimary) {
      await this.clearPrimary(businessId);
    }

    const location = this.locationsRepository.create({
      businessId,
      address: dto.address,
      city: dto.city,
      latitude: dto.latitude,
      longitude: dto.longitude,
      isPrimary: dto.isPrimary ?? false,
      operatingHours: (dto.operatingHours ?? []).map((hour) =>
        this.buildHour(hour),
      ),
    });

    return this.locationsRepository.save(location);
  }

  async update(
    locationId: string,
    user: User,
    dto: UpdateLocationDto,
  ): Promise<Location> {
    const location = await this.getLocationWithBusiness(locationId);
    assertOwnerOrAdmin(location.business.ownerId, user);

    if (dto.isPrimary) {
      await this.clearPrimary(location.businessId);
    }

    Object.assign(location, dto);
    return this.locationsRepository.save(location);
  }

  async remove(locationId: string, user: User): Promise<void> {
    const location = await this.getLocationWithBusiness(locationId);
    assertOwnerOrAdmin(location.business.ownerId, user);
    await this.locationsRepository.remove(location);
  }

  async getOperatingHours(locationId: string): Promise<OperatingHour[]> {
    await this.findOne(locationId);
    return this.hoursRepository.find({
      where: { locationId },
      order: { dayOfWeek: 'ASC' },
    });
  }

  async setOperatingHours(
    locationId: string,
    user: User,
    hours: OperatingHourDto[],
  ): Promise<Location> {
    const location = await this.getLocationWithBusiness(locationId);
    assertOwnerOrAdmin(location.business.ownerId, user);

    await this.hoursRepository.delete({ locationId });
    const entities = hours.map((hour) => this.buildHour(hour, locationId));
    await this.hoursRepository.save(entities);

    return this.findOne(locationId);
  }

  private buildHour(
    hour: OperatingHourDto,
    locationId?: string,
  ): OperatingHour {
    return this.hoursRepository.create({
      locationId,
      dayOfWeek: hour.dayOfWeek,
      openTime: hour.openTime ?? null,
      closeTime: hour.closeTime ?? null,
      isClosed: hour.isClosed ?? false,
    });
  }

  private async getLocationWithBusiness(locationId: string): Promise<Location> {
    const location = await this.locationsRepository.findOne({
      where: { locationId },
      relations: { business: true, operatingHours: true },
    });
    if (!location) {
      throw new NotFoundException(`Location ${locationId} not found`);
    }
    return location;
  }

  private async assertBusinessAccess(
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

  private async clearPrimary(businessId: string): Promise<void> {
    await this.locationsRepository.update({ businessId }, { isPrimary: false });
  }
}
