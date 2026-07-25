import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsObject,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateRoleDto {
  @ApiProperty({ example: 'Moderator' })
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  name: string;

  @ApiPropertyOptional({
    description: 'Granular permission map reserved for future phases.',
    example: { businesses: ['read', 'moderate'] },
  })
  @IsOptional()
  @IsObject()
  permissions?: Record<string, unknown>;
}
