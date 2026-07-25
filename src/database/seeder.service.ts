import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { RoleName } from '../common/enums/role-name.enum';
import { Role } from '../modules/roles/entities/role.entity';
import { User } from '../modules/users/entities/user.entity';

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
    private readonly config: ConfigService,
  ) {}

  async onApplicationBootstrap(): Promise<void> {
    await this.seedRoles();
    await this.seedAdmin();
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
}
