import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Location } from '../locations/entities/location.entity';
import { MapController } from './map.controller';
import { MapService } from './map.service';

@Module({
  imports: [TypeOrmModule.forFeature([Location])],
  controllers: [MapController],
  providers: [MapService],
})
export class MapModule {}
