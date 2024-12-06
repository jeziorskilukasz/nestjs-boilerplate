import { Module, UnprocessableEntityException } from '@nestjs/common';
import { randomStringGenerator } from '@nestjs/common/utils/random-string-generator.util';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

import { AllConfigType } from '~starter/config/config.type';
import { FilesController } from '~starter/modules/files/files.controller';
import { FilesService } from '~starter/modules/files/files.service';
import { PrismaModule } from '~starter/providers/prisma/prisma.module';

@Module({
  imports: [
    PrismaModule,
    MulterModule.registerAsync({
      imports: [ConfigModule, PrismaModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService<AllConfigType>) => {
        return {
          fileFilter: (_request, file, callback) => {
            if (!/\.(jpg|jpeg|png|gif)$/i.exec(file.originalname)) {
              return callback(new UnprocessableEntityException(), false);
            }
            callback(null, true);
          },
          // NOSONAR
          storage: diskStorage({
            destination: `./files/`,
            filename: (_request, file, callback) => {
              callback(
                null,
                `${randomStringGenerator()}.${file.originalname
                  .split('.')
                  .pop()
                  ?.toLowerCase()}`,
              );
            },
          }),
          limits: {
            fileSize: configService.get('file.maxFileSize', { infer: true }),
          },
        };
      },
    }),
  ],
  controllers: [FilesController],
  providers: [FilesService],
})
export class FilesModule {}
