import { Module } from '@nestjs/common';

import { ArticlesController } from '~starter/modules/articles/articles.controller';
import { ArticlesService } from '~starter/modules/articles/articles.service';
import { PrismaModule } from '~starter/providers/prisma/prisma.module';

@Module({
  controllers: [ArticlesController],
  providers: [ArticlesService],
  imports: [PrismaModule],
})
export class ArticlesModule {}
