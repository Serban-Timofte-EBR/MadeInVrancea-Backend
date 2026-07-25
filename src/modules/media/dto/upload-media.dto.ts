import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { MediaType } from '../../../common/enums/media-type.enum';

export class UploadMediaDto {
  @ApiProperty({
    enum: MediaType,
    description: 'The kind of asset being uploaded.',
  })
  @IsEnum(MediaType)
  type: MediaType;
}
