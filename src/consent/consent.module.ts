import { Module } from '@nestjs/common';

import { ConsentService } from '~starter/consent/consent.service';
import { PrismaModule } from '~starter/providers/prisma/prisma.module';

@Module({
  providers: [ConsentService],
  imports: [PrismaModule],
})
export class ConsentModule {}
