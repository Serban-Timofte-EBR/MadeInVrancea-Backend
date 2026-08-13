import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';
import { ActionType } from '../../../common/enums/action-type.enum';

export class CreateLogDto {
  @ApiProperty({ enum: ActionType })
  @IsEnum(ActionType)
  actionType: ActionType;

  @ApiPropertyOptional({
    description: 'Browser-generated token identifying a unique guest visitor.',
  })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  sessionId?: string;

  @ApiPropertyOptional({
    description: 'Id of the targeted entity (e.g. a business).',
  })
  @IsOptional()
  @IsUUID()
  targetId?: string;
}
