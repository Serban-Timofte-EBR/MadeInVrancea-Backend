import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, ValidateNested } from 'class-validator';
import { OperatingHourDto } from './operating-hour.dto';

export class SetOperatingHoursDto {
  @ApiProperty({ type: [OperatingHourDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OperatingHourDto)
  operatingHours: OperatingHourDto[];
}
