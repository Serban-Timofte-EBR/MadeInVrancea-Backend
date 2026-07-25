import { ForbiddenException } from '@nestjs/common';
import { RoleName } from '../enums/role-name.enum';
import { User } from '../../modules/users/entities/user.entity';

/**
 * Ensures the current user either owns the resource or is an administrator.
 * Throws {@link ForbiddenException} otherwise.
 */
export function assertOwnerOrAdmin(ownerId: string, user: User): void {
  const isAdmin = user?.role?.name === RoleName.ADMIN;
  if (!isAdmin && ownerId !== user?.userId) {
    throw new ForbiddenException('You do not have access to this resource');
  }
}
