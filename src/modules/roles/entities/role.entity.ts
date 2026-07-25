import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('roles')
export class Role {
  @PrimaryGeneratedColumn('uuid')
  roleId: string;

  @Column({ unique: true })
  name: string;

  /** Granular permission map, stored as JSON. Reserved for future phases. */
  @Column({ type: 'simple-json', nullable: true })
  permissions: Record<string, unknown> | null;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => User, (user) => user.role)
  users: User[];
}
