import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Put,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { User } from '../users/entities/user.entity';
import { CreateLocationDto } from './dto/create-location.dto';
import { SetOperatingHoursDto } from './dto/set-operating-hours.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { LocationsService } from './locations.service';

@ApiTags('locations')
@Controller()
export class LocationsController {
  constructor(private readonly locationsService: LocationsService) {}

  @Public()
  @Get('businesses/:businessId/locations')
  @ApiOperation({ summary: 'List the locations of a business' })
  findByBusiness(@Param('businessId', ParseUUIDPipe) businessId: string) {
    return this.locationsService.findByBusiness(businessId);
  }

  @Post('businesses/:businessId/locations')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Add a location to a business (owner or admin)' })
  create(
    @Param('businessId', ParseUUIDPipe) businessId: string,
    @CurrentUser() user: User,
    @Body() dto: CreateLocationDto,
  ) {
    return this.locationsService.create(businessId, user, dto);
  }

  @Patch('locations/:id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a location (owner or admin)' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: User,
    @Body() dto: UpdateLocationDto,
  ) {
    return this.locationsService.update(id, user, dto);
  }

  @Delete('locations/:id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a location (owner or admin)' })
  remove(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user: User) {
    return this.locationsService.remove(id, user);
  }

  @Public()
  @Get('locations/:id/operating-hours')
  @ApiOperation({ summary: 'Get the weekly schedule of a location' })
  getOperatingHours(@Param('id', ParseUUIDPipe) id: string) {
    return this.locationsService.getOperatingHours(id);
  }

  @Put('locations/:id/operating-hours')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Replace the weekly schedule of a location (owner or admin)',
  })
  setOperatingHours(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: User,
    @Body() dto: SetOperatingHoursDto,
  ) {
    return this.locationsService.setOperatingHours(
      id,
      user,
      dto.operatingHours,
    );
  }
}
