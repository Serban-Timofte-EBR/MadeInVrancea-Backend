import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { RoleName } from '../../common/enums/role-name.enum';
import { User } from '../users/entities/user.entity';
import { BusinessesService } from './businesses.service';
import { CreateBusinessDto } from './dto/create-business.dto';
import { QueryBusinessDto } from './dto/query-business.dto';
import { RejectBusinessDto } from './dto/reject-business.dto';
import { UpdateBusinessDto } from './dto/update-business.dto';

@ApiTags('businesses')
@Controller('businesses')
export class BusinessesController {
  constructor(private readonly businessesService: BusinessesService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Search and list active businesses (paginated)' })
  findPublic(@Query() query: QueryBusinessDto) {
    return this.businessesService.findPublic(query);
  }

  @Get('me/list')
  @ApiBearerAuth()
  @Roles(RoleName.BUSINESS_OWNER, RoleName.ADMIN)
  @ApiOperation({ summary: 'List the businesses owned by the current user' })
  findMine(@CurrentUser() user: User) {
    return this.businessesService.findMine(user.userId);
  }

  @Get('admin/pending')
  @ApiBearerAuth()
  @Roles(RoleName.ADMIN)
  @ApiOperation({ summary: 'List businesses awaiting vetting (admin only)' })
  findPending() {
    return this.businessesService.findPending();
  }

  @Public()
  @Get('slug/:slug')
  @ApiOperation({ summary: 'Get an active business profile by SEO slug' })
  findBySlug(@Param('slug') slug: string) {
    return this.businessesService.findBySlugActive(slug);
  }

  @Get('me/:id')
  @ApiBearerAuth()
  @Roles(RoleName.BUSINESS_OWNER, RoleName.ADMIN)
  @ApiOperation({
    summary: "Get one of the current user's businesses (any status)",
  })
  findOneOwned(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: User,
  ) {
    return this.businessesService.findOneOwned(id, user);
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Get an active business profile by id' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.businessesService.findOneActive(id);
  }

  @Post()
  @ApiBearerAuth()
  @Roles(RoleName.BUSINESS_OWNER, RoleName.ADMIN)
  @ApiOperation({
    summary: 'Create a business (onboarding). Starts in Pending status.',
  })
  create(@CurrentUser() user: User, @Body() dto: CreateBusinessDto) {
    return this.businessesService.create(user.userId, dto);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a business (owner or admin)' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: User,
    @Body() dto: UpdateBusinessDto,
  ) {
    return this.businessesService.update(id, user, dto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a business (owner or admin)' })
  remove(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user: User) {
    return this.businessesService.remove(id, user);
  }

  @Patch(':id/approve')
  @ApiBearerAuth()
  @Roles(RoleName.ADMIN)
  @ApiOperation({ summary: 'Approve and publish a business (admin only)' })
  approve(@Param('id', ParseUUIDPipe) id: string) {
    return this.businessesService.approve(id);
  }

  @Patch(':id/reject')
  @ApiBearerAuth()
  @Roles(RoleName.ADMIN)
  @ApiOperation({ summary: 'Reject a business with a reason (admin only)' })
  reject(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: RejectBusinessDto,
  ) {
    return this.businessesService.reject(id, dto.reason);
  }

  @Patch(':id/suspend')
  @ApiBearerAuth()
  @Roles(RoleName.ADMIN)
  @ApiOperation({ summary: 'Suspend an active business (admin only)' })
  suspend(@Param('id', ParseUUIDPipe) id: string) {
    return this.businessesService.suspend(id);
  }
}
