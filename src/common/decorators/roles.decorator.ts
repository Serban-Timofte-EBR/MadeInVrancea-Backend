import { SetMetadata } from '@nestjs/common';
import { RoleName } from '../enums/role-name.enum';

export const ROLES_KEY = 'roles';

/** Restricts a route to users owning one of the provided roles. */
export const Roles = (...roles: RoleName[]) => SetMetadata(ROLES_KEY, roles);
