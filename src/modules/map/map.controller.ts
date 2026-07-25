import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from '../../common/decorators/public.decorator';
import { MapQueryDto } from './dto/map-query.dto';
import { MapService } from './map.service';

@ApiTags('map')
@Controller('map')
export class MapController {
  constructor(private readonly mapService: MapService) {}

  @Public()
  @Get('pins')
  @ApiOperation({
    summary: 'Get map pins for active businesses within an optional viewport',
  })
  getPins(@Query() query: MapQueryDto) {
    return this.mapService.getPins(query);
  }
}
