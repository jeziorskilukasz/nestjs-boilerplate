import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Response } from 'express';

import { AuthenticatedRequest } from '~starter/modules/auth/types/login-response.type';
import { UploadFileDto } from '~starter/modules/files/dto/upload-file.dto';
import { FileEntity } from '~starter/modules/files/entities/file.entity';
import { FilesService } from '~starter/modules/files/files.service';
import { ErrorValidationEntity } from '~starter/shared/errors/error-validation';

@ApiTags('files')
@Controller({
  path: 'files',
  version: '1',
})
@ApiResponse({ status: 500, description: 'Internal server error' })
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiResponse({
    status: 422,
    description: 'Unprocessable Entity - No file selected or missing user ID.',
  })
  @Post('upload')
  @ApiOperation({
    summary: 'Upload File',
    description: 'Uploads a file with a specified category.',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
        category: {
          type: 'string',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  @HttpCode(HttpStatus.OK)
  @ApiCreatedResponse({ type: FileEntity })
  @ApiResponse({
    status: 422,
    description:
      'Validation Error - One or more fields did not pass validation',
    type: ErrorValidationEntity,
  })
  async uploadFile(
    @Body() uploadFile: UploadFileDto,
    @Req() request: AuthenticatedRequest,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const userId = request?.user['id'];
    const category = uploadFile['category'];

    return new FileEntity(
      await this.filesService.create(file, userId, category),
    );
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Get(':fileName')
  @ApiOperation({
    summary: 'Download File',
    description: 'Downloads the specified file.',
  })
  @ApiResponse({
    status: 403,
    description:
      'Forbidden - You do not have permission to view this file or file does not exist.',
  })
  @HttpCode(HttpStatus.OK)
  async download(
    @Param('fileName') fileName: string,
    @Req() request: AuthenticatedRequest,
    @Res() res: Response,
  ) {
    const userId = request?.user['id'];
    const file = new FileEntity(
      await this.filesService.getFileByFileName(fileName, userId),
    );

    return res.sendFile(file.path.split('/').pop(), { root: './files' });
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Delete(':fileName')
  @ApiOperation({
    summary: 'Delete File',
    description: 'Deletes the specified file.',
  })
  @ApiResponse({
    status: 403,
    description:
      'Forbidden - You do not have permission to delete this file or file does not exist.',
  })
  @HttpCode(HttpStatus.OK)
  async deleteFile(
    @Param('fileName') fileName: string,
    @Req() request: AuthenticatedRequest,
  ) {
    const userId = request?.user['id'];
    const response = await this.filesService.deleteFileByFileName(
      fileName,
      userId,
    );
    return response;
  }
}
