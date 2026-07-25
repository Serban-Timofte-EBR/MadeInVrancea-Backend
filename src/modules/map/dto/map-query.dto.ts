import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

/**
 * Optional viewport bounding box plus filters used to fetch map pins.
 * When the bounding box is provided, only pins inside it are returned, which
 * keeps payloads small even with hundreds of businesses.
 */
export class MapQueryDto {
  @ApiPropertyOptional({ description: 'South-west latitude of the viewport.' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(-90)
  @Max(90)
  minLat?: number;

  @ApiPropertyOptional({ description: 'North-east latitude of the viewport.' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(-90)
  @Max(90)
  maxLat?: number;

  @ApiPropertyOptional({ description: 'South-west longitude of the viewport.' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(-180)
  @Max(180)
  minLng?: number;

  @ApiPropertyOptional({ description: 'North-east longitude of the viewport.' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(-180)
  @Max(180)
  maxLng?: number;

  @ApiPropertyOptional({ description: 'Only include pins from this category.' })
  @IsOptional()
  @IsUUID()
  categoryId?: string;

  @ApiPropertyOptional({
    description: 'Free-text search on the business name.',
  })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  search?: string;
}
