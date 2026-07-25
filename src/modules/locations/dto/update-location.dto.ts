import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateLocationDto } from './create-location.dto';

/** Operating hours are managed through their dedicated endpoint. */
export class UpdateLocationDto extends PartialType(
  OmitType(CreateLocationDto, ['operatingHours'] as const),
) {}
