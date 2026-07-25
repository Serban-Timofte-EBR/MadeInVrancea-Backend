import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ColumnNumericTransformer } from '../../../common/transformers/numeric.transformer';
import { Business } from '../../businesses/entities/business.entity';
import { OperatingHour } from './operating-hour.entity';

@Entity('locations')
export class Location {
  @PrimaryGeneratedColumn('uuid')
  locationId: string;

  @ManyToOne(() => Business, (business) => business.locations, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'businessId' })
  business: Business;

  @Column()
  businessId: string;

  @Column()
  address: string;

  @Column()
  city: string;

  @Column({
    type: 'decimal',
    precision: 9,
    scale: 6,
    transformer: new ColumnNumericTransformer(),
  })
  latitude: number;

  @Column({
    type: 'decimal',
    precision: 9,
    scale: 6,
    transformer: new ColumnNumericTransformer(),
  })
  longitude: number;

  @Column({ default: false })
  isPrimary: boolean;

  @OneToMany(() => OperatingHour, (hour) => hour.location, { cascade: true })
  operatingHours: OperatingHour[];
}
