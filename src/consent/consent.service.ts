import { Injectable } from '@nestjs/common';

import { UserEntity } from '~starter/modules/users/entities/user.entity';
import { PrismaService } from '~starter/providers/prisma/prisma.service';

@Injectable()
export class ConsentService {
  constructor(private db: PrismaService) {}

  deleteMany(id: UserEntity['id']) {
    return this.db.consent.deleteMany({
      where: {
        userId: id,
      },
    });
  }

  findFirst(id: UserEntity['id']) {
    return this.db.consent.findFirst({
      where: { userId: id },
      orderBy: { createdAt: 'desc' },
      select: {
        privacyPolicyAccepted: true,
        termsAccepted: true,
        createdAt: true,
        updatedAt: true,
        termsVersion: true,
        privacyPolicyVersion: true,
      },
    });
  }
}
