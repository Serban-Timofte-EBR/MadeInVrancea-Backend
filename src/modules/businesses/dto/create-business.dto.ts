import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsEmail,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { CreateLocationDto } from '../../locations/dto/create-location.dto';

export class CreateBusinessDto {
  @ApiProperty({ example: 'Crama Gîrboiu' })
  @IsString()
  @MaxLength(200)
  name: string;

  @ApiPropertyOptional({
    example: 'Cramă de familie din Vrancea, tradiție din 1949.',
  })
  @IsOptional()
  @IsString()
  @MaxLength(4000)
  description?: string;

  @ApiPropertyOptional({
    description: 'CUI / CIF fiscal identifier.',
    example: 'RO1234567',
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  taxId?: string;

  @ApiPropertyOptional({ example: '+40237123456' })
  @IsOptional()
  @IsString()
  @MaxLength(30)
  contactPhone?: string;

  @ApiPropertyOptional({ example: 'contact@crama-girboiu.ro' })
  @IsOptional()
  @IsEmail()
  contactEmail?: string;

  @ApiPropertyOptional({ example: 'https://crama-girboiu.ro' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  websiteURL?: string;

  @ApiPropertyOptional({
    description: 'Social media links keyed by network.',
    example: {
      facebook: 'https://facebook.com/...',
      instagram: 'https://instagram.com/...',
    },
  })
  @IsOptional()
  @IsObject()
  socialLinks?: Record<string, string>;

  @ApiProperty({
    description: 'One or more category ids the business belongs to.',
    type: [String],
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsUUID('4', { each: true })
  categoryIds: string[];

  @ApiPropertyOptional({
    description: 'Primary location placed on the map during onboarding.',
    type: CreateLocationDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => CreateLocationDto)
  location?: CreateLocationDto;
}
