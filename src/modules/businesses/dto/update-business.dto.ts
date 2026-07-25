import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateBusinessDto } from './create-business.dto';

/** The onboarding location is created/updated through the locations endpoints. */
export class UpdateBusinessDto extends PartialType(
  OmitType(CreateBusinessDto, ['location'] as const),
) {}
