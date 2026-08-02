import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsEmail,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { CreateLocationDto } from '../../locations/dto/create-location.dto';

export class CreateBusinessDto {
  @ApiProperty({ example: 'Crama Gîrboiu' })
  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim().replace(/\s+/g, ' ') : value,
  )
  @IsString()
  @MinLength(2)
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
  @Transform(({ value }) =>
    typeof value === 'string'
      ? value
          .trim()
          .toUpperCase()
          .replace(/[\s.-]/g, '')
          .replace(/^RO(?=\d)/, '')
      : value,
  )
  @IsString()
  @Matches(/^\d{2,10}$/, {
    message: 'CUI / CIF must contain between 2 and 10 digits',
  })
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
  @IsUUID(undefined, { each: true })
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
