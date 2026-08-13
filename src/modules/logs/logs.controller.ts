import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Req,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import type { Request } from 'express';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { RoleName } from '../../common/enums/role-name.enum';
import { User } from '../users/entities/user.entity';
import { CreateLogDto } from './dto/create-log.dto';
import { LogsService } from './logs.service';

@ApiTags('logs')
@Controller()
export class LogsController {
  constructor(private readonly logsService: LogsService) {}

  @Public()
  @Post('logs')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary:
      'Record a visitor traffic event (profile view, map search, click-to-call)',
  })
  record(@Body() dto: CreateLogDto, @Req() request: Request) {
    return this.logsService.record(dto, {
      ipAddress: request.ip,
      userAgent: request.headers['user-agent'],
    });
  }

  @Get('businesses/:businessId/analytics')
  @ApiBearerAuth()
  @Roles(RoleName.BUSINESS_OWNER, RoleName.ADMIN)
  @ApiOperation({
    summary: 'Traffic statistics for a business (owner or admin)',
  })
  getAnalytics(
    @Param('businessId', ParseUUIDPipe) businessId: string,
    @CurrentUser() user: User,
  ) {
    return this.logsService.getBusinessAnalytics(businessId, user);
  }
}
