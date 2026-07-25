import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({ example: 'Crame' })
  @IsString()
  @MaxLength(100)
  name: string;

  @ApiPropertyOptional({
    description: 'SEO slug. Generated from the name when omitted.',
    example: 'crame',
  })
  @IsOptional()
  @IsString()
  @MaxLength(120)
  slug?: string;

  @ApiPropertyOptional({ description: 'Parent category id for subcategories.' })
  @IsOptional()
  @IsUUID()
  parentId?: string;

  @ApiPropertyOptional({ description: 'URL of the custom map pin icon.' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  iconURL?: string;
}
