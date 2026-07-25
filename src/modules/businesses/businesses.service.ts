import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsRelations, In, Repository } from 'typeorm';
import { BusinessStatus } from '../../common/enums/business-status.enum';
import { assertOwnerOrAdmin } from '../../common/utils/ownership';
import { slugify } from '../../common/utils/slugify';
import { Category } from '../categories/entities/category.entity';
import { User } from '../users/entities/user.entity';
import { CreateBusinessDto } from './dto/create-business.dto';
import { QueryBusinessDto } from './dto/query-business.dto';
import { UpdateBusinessDto } from './dto/update-business.dto';
import { Business } from './entities/business.entity';

const FULL_RELATIONS: FindOptionsRelations<Business> = {
  categories: true,
  locations: { operatingHours: true },
  media: true,
};

export interface PaginatedBusinesses {
  data: Business[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

@Injectable()
export class BusinessesService {
  constructor(
    @InjectRepository(Business)
    private readonly businessRepository: Repository<Business>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async create(ownerId: string, dto: CreateBusinessDto): Promise<Business> {
    const slug = await this.generateUniqueSlug(dto.name);
    const categories = await this.resolveCategories(dto.categoryIds);

    const business = this.businessRepository.create({
      ownerId,
      name: dto.name,
      slug,
      description: dto.description ?? null,
      taxId: dto.taxId ?? null,
      contactPhone: dto.contactPhone ?? null,
      contactEmail: dto.contactEmail ?? null,
      websiteURL: dto.websiteURL ?? null,
      socialLinks: dto.socialLinks ?? null,
      status: BusinessStatus.PENDING,
      categories,
      locations: dto.location
        ? [
            {
              address: dto.location.address,
              city: dto.location.city,
              latitude: dto.location.latitude,
              longitude: dto.location.longitude,
              isPrimary: dto.location.isPrimary ?? true,
              operatingHours: (dto.location.operatingHours ?? []).map(
                (hour) => ({
                  dayOfWeek: hour.dayOfWeek,
                  openTime: hour.openTime ?? null,
                  closeTime: hour.closeTime ?? null,
                  isClosed: hour.isClosed ?? false,
                }),
              ),
            },
          ]
        : [],
    });

    const saved = await this.businessRepository.save(business);
    return this.findById(saved.businessId);
  }

  /** Public, paginated listing. Only Active businesses are returned. */
  async findPublic(query: QueryBusinessDto): Promise<PaginatedBusinesses> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;

    const qb = this.businessRepository
      .createQueryBuilder('b')
      .leftJoinAndSelect('b.categories', 'c')
      .leftJoinAndSelect('b.locations', 'l')
      .leftJoinAndSelect('b.media', 'm')
      .where('b.status = :status', { status: BusinessStatus.ACTIVE });

    if (query.search) {
      qb.andWhere('(b.name LIKE :search OR b.description LIKE :search)', {
        search: `%${query.search}%`,
      });
    }

    if (query.city) {
      qb.andWhere('l.city = :city', { city: query.city });
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

    if (query.categorySlug) {
      qb.andWhere(
        (sub) =>
          'b.businessId IN ' +
          sub
            .subQuery()
            .select('bc.businessId')
            .from('business_categories', 'bc')
            .innerJoin('categories', 'cat', 'cat.categoryId = bc.categoryId')
            .where('cat.slug = :categorySlug')
            .getQuery(),
      ).setParameter('categorySlug', query.categorySlug);
    }

    qb.orderBy('b.name', 'ASC')
      .skip((page - 1) * limit)
      .take(limit);

    const [data, total] = await qb.getManyAndCount();

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 0,
    };
  }

  async findOneActive(id: string): Promise<Business> {
    const business = await this.businessRepository.findOne({
      where: { businessId: id, status: BusinessStatus.ACTIVE },
      relations: FULL_RELATIONS,
    });
    if (!business) {
      throw new NotFoundException(`Business ${id} not found`);
    }
    return business;
  }

  async findBySlugActive(slug: string): Promise<Business> {
    const business = await this.businessRepository.findOne({
      where: { slug, status: BusinessStatus.ACTIVE },
      relations: FULL_RELATIONS,
    });
    if (!business) {
      throw new NotFoundException(`Business '${slug}' not found`);
    }
    return business;
  }

  findMine(ownerId: string): Promise<Business[]> {
    return this.businessRepository.find({
      where: { ownerId },
      relations: FULL_RELATIONS,
      order: { createdAt: 'DESC' },
    });
  }

  async findOneOwned(id: string, user: User): Promise<Business> {
    const business = await this.findById(id);
    assertOwnerOrAdmin(business.ownerId, user);
    return business;
  }

  async update(
    id: string,
    user: User,
    dto: UpdateBusinessDto,
  ): Promise<Business> {
    const business = await this.findById(id);
    assertOwnerOrAdmin(business.ownerId, user);

    if (dto.name && dto.name !== business.name) {
      business.name = dto.name;
      business.slug = await this.generateUniqueSlug(dto.name);
    }

    if (dto.description !== undefined)
      business.description = dto.description ?? null;
    if (dto.taxId !== undefined) business.taxId = dto.taxId ?? null;
    if (dto.contactPhone !== undefined)
      business.contactPhone = dto.contactPhone ?? null;
    if (dto.contactEmail !== undefined)
      business.contactEmail = dto.contactEmail ?? null;
    if (dto.websiteURL !== undefined)
      business.websiteURL = dto.websiteURL ?? null;
    if (dto.socialLinks !== undefined)
      business.socialLinks = dto.socialLinks ?? null;
    if (dto.categoryIds)
      business.categories = await this.resolveCategories(dto.categoryIds);

    await this.businessRepository.save(business);
    return this.findById(id);
  }

  async remove(id: string, user: User): Promise<void> {
    const business = await this.findById(id);
    assertOwnerOrAdmin(business.ownerId, user);
    await this.businessRepository.remove(business);
  }

  // ----- Admin vetting -----

  findPending(): Promise<Business[]> {
    return this.businessRepository.find({
      where: { status: BusinessStatus.PENDING },
      relations: FULL_RELATIONS,
      order: { createdAt: 'ASC' },
    });
  }

  async approve(id: string): Promise<Business> {
    const business = await this.findById(id);
    business.status = BusinessStatus.ACTIVE;
    business.rejectionReason = null;
    await this.businessRepository.save(business);
    return this.findById(id);
  }

  async reject(id: string, reason: string): Promise<Business> {
    const business = await this.findById(id);
    business.status = BusinessStatus.REJECTED;
    business.rejectionReason = reason;
    await this.businessRepository.save(business);
    return this.findById(id);
  }

  async suspend(id: string): Promise<Business> {
    const business = await this.findById(id);
    business.status = BusinessStatus.SUSPENDED;
    await this.businessRepository.save(business);
    return this.findById(id);
  }

  private async findById(id: string): Promise<Business> {
    const business = await this.businessRepository.findOne({
      where: { businessId: id },
      relations: FULL_RELATIONS,
    });
    if (!business) {
      throw new NotFoundException(`Business ${id} not found`);
    }
    return business;
  }

  private async resolveCategories(ids: string[]): Promise<Category[]> {
    if (!ids || ids.length === 0) {
      return [];
    }
    const categories = await this.categoryRepository.findBy({
      categoryId: In(ids),
    });
    if (categories.length !== ids.length) {
      throw new NotFoundException('One or more categories were not found');
    }
    return categories;
  }

  private async generateUniqueSlug(name: string): Promise<string> {
    const base = slugify(name);
    let candidate = base;
    let suffix = 2;
    while (
      await this.businessRepository.findOne({ where: { slug: candidate } })
    ) {
      candidate = `${base}-${suffix}`;
      suffix += 1;
    }
    return candidate;
  }
}
