import { Module } from '@nestjs/common';

import { PrismaService } from '~starter/providers/prisma/prisma.service';

@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
