import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';

export class RejectBusinessDto {
  @ApiProperty({ example: 'CUI-ul furnizat nu poate fi verificat.' })
  @IsString()
  @MinLength(3)
  @MaxLength(500)
  reason: string;
}
