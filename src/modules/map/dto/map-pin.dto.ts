import { ApiProperty } from '@nestjs/swagger';

export class MapPinCategoryDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  slug: string;

  @ApiProperty({ nullable: true })
  iconURL: string | null;
}

export class MapPinDto {
  @ApiProperty()
  locationId: string;

  @ApiProperty()
  businessId: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  slug: string;

  @ApiProperty()
  latitude: number;

  @ApiProperty()
  longitude: number;

  @ApiProperty()
  address: string;

  @ApiProperty()
  city: string;

  @ApiProperty({ type: MapPinCategoryDto, nullable: true })
  category: MapPinCategoryDto | null;

  @ApiProperty({ nullable: true })
  logoUrl: string | null;
}
