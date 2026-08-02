import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { MediaType } from '../../../common/enums/media-type.enum';
import { Business } from '../../businesses/entities/business.entity';

@Entity('media_assets')
export class MediaAsset {
  @PrimaryGeneratedColumn('uuid')
  mediaId: string;

  @ManyToOne(() => Business, (business) => business.media, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'businessId' })
  business: Business;

  @Column({ type: 'uniqueidentifier' })
  businessId: string;

  @Column({ type: 'varchar', length: 20 })
  entityType: MediaType;

  /** Publicly accessible URL of the stored asset. */
  @Column()
  fileURL: string;

  /** Blob name inside the storage container, used for deletion. */
  @Column({ type: 'nvarchar', nullable: true })
  blobName: string | null;

  @CreateDateColumn()
  uploadDate: Date;
}
