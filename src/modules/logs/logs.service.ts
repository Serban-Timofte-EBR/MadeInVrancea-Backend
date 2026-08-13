import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ActionType } from '../../common/enums/action-type.enum';
import { assertOwnerOrAdmin } from '../../common/utils/ownership';
import { Business } from '../businesses/entities/business.entity';
import { User } from '../users/entities/user.entity';
import { CreateLogDto } from './dto/create-log.dto';
import { ConnectionLog } from './entities/connection-log.entity';

export interface LogMetadata {
  ipAddress?: string;
  userAgent?: string;
  userId?: string;
}

export interface BusinessAnalytics {
  businessId: string;
  profileViews: number;
  uniqueVisitors: number;
  clickToCall: number;
}

@Injectable()
export class LogsService {
  constructor(
    @InjectRepository(ConnectionLog)
    private readonly logsRepository: Repository<ConnectionLog>,
    @InjectRepository(Business)
    private readonly businessRepository: Repository<Business>,
  ) {}

  async record(
    dto: CreateLogDto,
    meta: LogMetadata,
  ): Promise<{ logId: string }> {
    const log = this.logsRepository.create({
      actionType: dto.actionType,
      sessionId: dto.sessionId ?? null,
      targetId: dto.targetId ?? null,
      userId: meta.userId ?? null,
      ipAddress: meta.ipAddress ?? null,
      userAgent: meta.userAgent ?? null,
    });
    const saved = await this.logsRepository.save(log);
    return { logId: saved.logId };
  }

  async getBusinessAnalytics(
    businessId: string,
    user: User,
  ): Promise<BusinessAnalytics> {
    const business = await this.businessRepository.findOne({
      where: { businessId },
    });
    if (!business) {
      throw new NotFoundException(`Business ${businessId} not found`);
    }
    assertOwnerOrAdmin(business.ownerId, user);

    const profileViews = await this.logsRepository.count({
      where: { targetId: businessId, actionType: ActionType.VIEW_PROFILE },
    });

    const clickToCall = await this.logsRepository.count({
      where: { targetId: businessId, actionType: ActionType.CLICK_TO_CALL },
    });

    const uniqueRaw = await this.logsRepository
      .createQueryBuilder('log')
      .select('COUNT(DISTINCT log.sessionId)', 'count')
      .where('log.targetId = :businessId', { businessId })
      .andWhere('log.actionType = :action', { action: ActionType.VIEW_PROFILE })
      .getRawOne<{ count: string }>();

    return {
      businessId,
      profileViews,
      uniqueVisitors: Number(uniqueRaw?.count ?? 0),
      clickToCall,
    };
  }
}
