import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsInt,
  IsOptional,
  Matches,
  Max,
  Min,
} from 'class-validator';

const TIME_REGEX = /^([01]\d|2[0-3]):[0-5]\d$/;

export class OperatingHourDto {
  @ApiProperty({
    description: '1 = Monday ... 7 = Sunday',
    minimum: 1,
    maximum: 7,
  })
  @IsInt()
  @Min(1)
  @Max(7)
  dayOfWeek: number;

  @ApiPropertyOptional({
    example: '09:00',
    description: 'Opening time (HH:mm).',
  })
  @IsOptional()
  @Matches(TIME_REGEX, { message: 'openTime must be in HH:mm format' })
  openTime?: string;

  @ApiPropertyOptional({
    example: '18:00',
    description: 'Closing time (HH:mm).',
  })
  @IsOptional()
  @Matches(TIME_REGEX, { message: 'closeTime must be in HH:mm format' })
  closeTime?: string;

  @ApiPropertyOptional({
    description: 'True when the location is closed that day.',
  })
  @IsOptional()
  @IsBoolean()
  isClosed?: boolean;
}
