import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Location } from './location.entity';

@Entity('operating_hours')
export class OperatingHour {
  @PrimaryGeneratedColumn('uuid')
  scheduleId: string;

  @ManyToOne(() => Location, (location) => location.operatingHours, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'locationId' })
  location: Location;

  @Column()
  locationId: string;

  /** 1 = Monday ... 7 = Sunday. */
  @Column({ type: 'int' })
  dayOfWeek: number;

  /** Opening time in 'HH:mm' format. Null when the location is closed. */
  @Column({ type: 'varchar', length: 5, nullable: true })
  openTime: string | null;

  /** Closing time in 'HH:mm' format. Null when the location is closed. */
  @Column({ type: 'varchar', length: 5, nullable: true })
  closeTime: string | null;

  @Column({ default: false })
  isClosed: boolean;
}
