import { Module } from '@nestjs/common';

import { UsersController } from '~starter/modules/users/users.controller';
import { UsersService } from '~starter/modules/users/users.service';
import { PrismaModule } from '~starter/providers/prisma/prisma.module';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports: [PrismaModule],
})
export class UsersModule {}
