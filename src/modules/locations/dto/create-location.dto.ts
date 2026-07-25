import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsLatitude,
  IsLongitude,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { OperatingHourDto } from './operating-hour.dto';

export class CreateLocationDto {
  @ApiProperty({ example: 'Str. Mare a Unirii 10' })
  @IsString()
  @MaxLength(255)
  address: string;

  @ApiProperty({ example: 'Focșani' })
  @IsString()
  @MaxLength(120)
  city: string;

  @ApiProperty({ example: 45.696, description: 'Latitude (WGS84).' })
  @IsLatitude()
  latitude: number;

  @ApiProperty({ example: 27.185, description: 'Longitude (WGS84).' })
  @IsLongitude()
  longitude: number;

  @ApiPropertyOptional({
    description: 'Marks this as the primary location shown on the map.',
  })
  @IsOptional()
  @IsBoolean()
  isPrimary?: boolean;

  @ApiPropertyOptional({ type: [OperatingHourDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OperatingHourDto)
  operatingHours?: OperatingHourDto[];
}
