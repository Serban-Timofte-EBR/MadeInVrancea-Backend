import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { RoleName } from '../common/enums/role-name.enum';
import { MediaType } from '../common/enums/media-type.enum';
import { Business } from '../modules/businesses/entities/business.entity';
import { Category } from '../modules/categories/entities/category.entity';
import { Role } from '../modules/roles/entities/role.entity';
import { User } from '../modules/users/entities/user.entity';
import { SEED_BUSINESSES, SEED_CATEGORIES } from './sample-data';

/**
 * Seeds the mandatory system roles and a default administrator account the
 * first time the application boots against an empty database. This makes the
 * API immediately usable (admin can log in, owners can register).
 */
@Injectable()
export class SeederService implements OnApplicationBootstrap {
  private readonly logger = new Logger(SeederService.name);

  constructor(
    @InjectRepository(Role)
    private readonly rolesRepository: Repository<Role>,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(Category)
    private readonly categoriesRepository: Repository<Category>,
    @InjectRepository(Business)
    private readonly businessesRepository: Repository<Business>,
    private readonly config: ConfigService,
  ) {}

  async onApplicationBootstrap(): Promise<void> {
    await this.seedRoles();
    await this.seedAdmin();
    await this.seedCategories();
    await this.seedSampleBusinesses();
  }

  private async seedRoles(): Promise<void> {
    for (const name of Object.values(RoleName)) {
      const exists = await this.rolesRepository.findOne({ where: { name } });
      if (!exists) {
        await this.rolesRepository.save(this.rolesRepository.create({ name }));
        this.logger.log(`Seeded role: ${name}`);
      }
    }
  }

  private async seedAdmin(): Promise<void> {
    const email = this.config.get<string>('admin.email');
    const password = this.config.get<string>('admin.password');
    if (!email || !password) {
      return;
    }

    const existing = await this.usersRepository.findOne({ where: { email } });
    if (existing) {
      return;
    }

    const adminRole = await this.rolesRepository.findOne({
      where: { name: RoleName.ADMIN },
    });
    if (!adminRole) {
      return;
    }

    const passwordHash = await bcrypt.hash(password, 10);
    await this.usersRepository.save(
      this.usersRepository.create({
        email,
        passwordHash,
        firstName: 'Admin',
        lastName: 'Made in Vrancea',
        roleId: adminRole.roleId,
      }),
    );
    this.logger.log(`Seeded default admin user: ${email}`);
  }

  private async seedCategories(): Promise<void> {
    for (const category of SEED_CATEGORIES) {
      const exists = await this.categoriesRepository.findOne({
        where: { slug: category.slug },
      });
      if (!exists) {
        await this.categoriesRepository.save(
          this.categoriesRepository.create({
            slug: category.slug,
            name: category.name,
            iconURL: null,
            parentId: null,
          }),
        );
      }
    }
  }

  private async seedSampleBusinesses(): Promise<void> {
    const existing = await this.businessesRepository.count();
    if (existing > 0) {
      return;
    }

    const ownerRole = await this.rolesRepository.findOne({
      where: { name: RoleName.BUSINESS_OWNER },
    });
    if (!ownerRole) {
      return;
    }

    const ownerEmail = 'owner@madeinvrancea.ro';
    let owner = await this.usersRepository.findOne({
      where: { email: ownerEmail },
    });
    if (!owner) {
      owner = await this.usersRepository.save(
        this.usersRepository.create({
          email: ownerEmail,
          passwordHash: await bcrypt.hash('Owner_password123', 10),
          firstName: 'Maria',
          lastName: 'Popescu',
          roleId: ownerRole.roleId,
        }),
      );
      this.logger.log(`Seeded sample business owner: ${ownerEmail}`);
    }

    const categories = await this.categoriesRepository.find();
    const bySlug = new Map(
      categories.map((category) => [category.slug, category]),
    );

    for (const seed of SEED_BUSINESSES) {
      const categoryEntities = seed.categorySlugs
        .map((slug) => bySlug.get(slug))
        .filter((category): category is Category => Boolean(category));

      const operatingHours = seed.hours.map((span, index) => ({
        dayOfWeek: index + 1,
        openTime: span ? span[0] : null,
        closeTime: span ? span[1] : null,
        isClosed: !span,
      }));

      const media = [
        {
          entityType: MediaType.COVER,
          fileURL: `https://picsum.photos/seed/miv-${seed.slug}-cover/1200/675`,
        },
        {
          entityType: MediaType.LOGO,
          fileURL: `https://picsum.photos/seed/miv-${seed.slug}-logo/240/240`,
        },
        ...Array.from({ length: 5 }, (_, index) => ({
          entityType: MediaType.GALLERY_IMAGE,
          fileURL: `https://picsum.photos/seed/miv-${seed.slug}-${index + 1}/900/600`,
        })),
      ];

      const business = this.businessesRepository.create({
        ownerId: owner.userId,
        name: seed.name,
        slug: seed.slug,
        description: seed.description,
        taxId: null,
        contactPhone: seed.contactPhone,
        contactEmail: seed.contactEmail,
        websiteURL: seed.websiteURL ?? null,
        socialLinks: seed.socialLinks ?? null,
        status: seed.status,
        categories: categoryEntities,
        locations: [
          {
            address: seed.location.address,
            city: seed.location.city,
            latitude: seed.location.latitude,
            longitude: seed.location.longitude,
            isPrimary: true,
            operatingHours,
          },
        ],
        media,
      });

      await this.businessesRepository.save(business);
    }

    this.logger.log(`Seeded ${SEED_BUSINESSES.length} sample businesses`);
  }
}
