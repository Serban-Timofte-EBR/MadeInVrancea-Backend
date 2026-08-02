import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { BusinessStatus } from '../../../common/enums/business-status.enum';
import { Category } from '../../categories/entities/category.entity';
import { Location } from '../../locations/entities/location.entity';
import { MediaAsset } from '../../media/entities/media-asset.entity';
import { User } from '../../users/entities/user.entity';

@Entity('businesses')
@Index('UQ_businesses_name', ['name'], { unique: true })
@Index('UQ_businesses_taxId', ['taxId'], {
  unique: true,
  where: '[taxId] IS NOT NULL',
})
export class Business {
  @PrimaryGeneratedColumn('uuid')
  businessId: string;

  @ManyToOne(() => User, (user) => user.businesses, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'ownerId' })
  owner: User;

  @Column({ type: 'uniqueidentifier' })
  ownerId: string;

  @Column()
  name: string;

  /** SEO-friendly identifier used in public URLs (e.g. /crame/crama-girboiu). */
  @Column({ unique: true })
  slug: string;

  @Column({ type: 'nvarchar', length: 'MAX', nullable: true })
  description: string | null;

  @Column({ type: 'nvarchar', nullable: true })
  taxId: string | null;

  @Column({ type: 'nvarchar', nullable: true })
  contactPhone: string | null;

  @Column({ type: 'nvarchar', nullable: true })
  contactEmail: string | null;

  @Column({ type: 'nvarchar', nullable: true })
  websiteURL: string | null;

  /** Social media links, e.g. { "facebook": "...", "instagram": "..." }. */
  @Column({ type: 'simple-json', nullable: true })
  socialLinks: Record<string, string> | null;

  @Column({ type: 'varchar', length: 20, default: BusinessStatus.PENDING })
  status: BusinessStatus;

  /** Reason provided by an administrator when a business is rejected. */
  @Column({ type: 'nvarchar', length: 'MAX', nullable: true })
  rejectionReason: string | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToMany(() => Category, (category) => category.businesses)
  @JoinTable({
    name: 'business_categories',
    joinColumn: { name: 'businessId', referencedColumnName: 'businessId' },
    inverseJoinColumn: {
      name: 'categoryId',
      referencedColumnName: 'categoryId',
    },
  })
  categories: Category[];

  @OneToMany(() => Location, (location) => location.business, { cascade: true })
  locations: Location[];

  @OneToMany(() => MediaAsset, (media) => media.business, { cascade: true })
  media: MediaAsset[];
}
