import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ActionType } from '../../../common/enums/action-type.enum';

@Entity('connection_logs')
export class ConnectionLog {
  @PrimaryGeneratedColumn('uuid')
  logId: string;

  /** Null for unauthenticated (guest) visitors. */
  @Index()
  @Column({ type: 'uniqueidentifier', nullable: true })
  userId: string | null;

  /** Browser-generated token used to track a unique guest across a session. */
  @Column({ type: 'nvarchar', nullable: true })
  sessionId: string | null;

  @Column({ type: 'nvarchar', nullable: true })
  ipAddress: string | null;

  @Column({ type: 'nvarchar', length: 'MAX', nullable: true })
  userAgent: string | null;

  @Column({ type: 'varchar', length: 30 })
  actionType: ActionType;

  /** Identifier of the entity the action targeted (e.g. a business). */
  @Index()
  @Column({ type: 'uniqueidentifier', nullable: true })
  targetId: string | null;

  @CreateDateColumn()
  createdAt: Date;
}
