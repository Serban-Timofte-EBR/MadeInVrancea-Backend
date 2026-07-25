import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Business } from '../../businesses/entities/business.entity';

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn('uuid')
  categoryId: string;

  @ManyToOne(() => Category, (category) => category.children, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'parentId' })
  parent: Category | null;

  @Column({ nullable: true })
  parentId: string | null;

  @OneToMany(() => Category, (category) => category.parent)
  children: Category[];

  @Column()
  name: string;

  @Column({ unique: true })
  slug: string;

  /** URL of the custom pin icon shown on the map for this category. */
  @Column({ nullable: true })
  iconURL: string | null;

  @ManyToMany(() => Business, (business) => business.categories)
  businesses: Business[];
}
