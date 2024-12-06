import * as fs from 'fs';
import * as util from 'util';

import {
  ForbiddenException,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { AllConfigType } from '~starter/config/config.type';
import { UploadFileDto } from '~starter/modules/files/dto/upload-file.dto';
import { FileEntity } from '~starter/modules/files/entities/file.entity';
import { UserEntity } from '~starter/modules/users/entities/user.entity';
import { PrismaService } from '~starter/providers/prisma/prisma.service';

@Injectable()
export class FilesService {
  constructor(
    private readonly configService: ConfigService<AllConfigType>,
    private readonly db: PrismaService,
  ) {}
  async create(
    file: Express.Multer.File,
    userId: UserEntity['id'],
    category: UploadFileDto['category'],
  ): Promise<FileEntity> {
    if (!file) {
      throw new UnprocessableEntityException('selectFile');
    }

    if (!userId) {
      throw new UnprocessableEntityException('missingUserId');
    }

    const fileData = await this.db.file.create({
      data: {
        name: file.originalname,
        path: `/${this.configService.get('app.apiPrefix', {
          infer: true,
        })}/v1/${file.path}`,
        mimeType: file.mimetype,
        size: file.size,
        userId,
        category,
      },
    });

    return {
      ...fileData,
      id: fileData.id.toString(),
    };
  }

  async getFileByFileName(
    fileName: FileEntity['name'],
    userId: UserEntity['id'],
  ): Promise<FileEntity | null> {
    const file = await this.db.file.findFirst({
      where: {
        path: `/${this.configService.get('app.apiPrefix', {
          infer: true,
        })}/v1/files/${fileName}`,
      },
    });

    if (!file || file.userId !== userId) {
      throw new ForbiddenException(
        'You do not have permission to view this file or file does not exist.',
      );
    }
    return file;
  }

  async deleteFileByFileName(
    fileName: FileEntity['name'],
    userId: UserEntity['id'],
  ): Promise<{ message: string }> {
    const file = await this.db.file.findFirst({
      where: {
        path: `/${this.configService.get('app.apiPrefix', {
          infer: true,
        })}/v1/files/${fileName}`,
        userId: userId,
      },
    });

    if (!file) {
      throw new ForbiddenException(
        'You do not have permission to delete this file or file does not exist.',
      );
    }

    const filePath = `./files/${fileName}`;
    const unlinkAsync = util.promisify(fs.unlink);

    await unlinkAsync(filePath).catch((error) => {
      throw new Error(
        `Failed to delete the file from the filesystem: ${error.message}`,
      );
    });

    await this.db.file.delete({
      where: { id: file.id },
    });

    return { message: 'File successfully deleted.' };
  }

  deleteMany(id: UserEntity['id']) {
    return this.db.file.deleteMany({
      where: {
        userId: id,
      },
    });
  }
}
