import {
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  ParseUUIDPipe,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { User } from '../users/entities/user.entity';
import { UploadMediaDto } from './dto/upload-media.dto';
import { MediaService } from './media.service';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

@ApiTags('media')
@Controller()
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Public()
  @Get('businesses/:businessId/media')
  @ApiOperation({ summary: 'List the media assets of a business' })
  findByBusiness(@Param('businessId', ParseUUIDPipe) businessId: string) {
    return this.mediaService.findByBusiness(businessId);
  }

  @Post('businesses/:businessId/media')
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: 'Upload a Logo, Cover or gallery image (owner or admin)',
  })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['file', 'type'],
      properties: {
        file: { type: 'string', format: 'binary' },
        type: { type: 'string', enum: ['Logo', 'Cover', 'GalleryImage'] },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  upload(
    @Param('businessId', ParseUUIDPipe) businessId: string,
    @CurrentUser() user: User,
    @Body() dto: UploadMediaDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: MAX_FILE_SIZE }),
          new FileTypeValidator({ fileType: /^image\/(jpe?g|png|webp)$/ }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    return this.mediaService.upload(businessId, user, file, dto.type);
  }

  @Delete('media/:id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a media asset (owner or admin)' })
  remove(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user: User) {
    return this.mediaService.remove(id, user);
  }
}
