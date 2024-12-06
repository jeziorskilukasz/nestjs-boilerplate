import { ConflictException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';

import { AuthProvidersEnum } from '~starter/modules/auth/auth-providers.enum';
import { CreateUserDto } from '~starter/modules/users/dto/create-user.dto';
import UpdateUserDto from '~starter/modules/users/dto/update-user.dto';
import { UserEntity } from '~starter/modules/users/entities/user.entity';
import { PrismaService } from '~starter/providers/prisma/prisma.service';
import { convertRoleIdToRoleNameEnum } from '~starter/roles/roles.decorator';
import { convertStatusIdToNameEnum } from '~starter/statuses/status.decorator';

@Injectable()
export class UsersService {
  constructor(private db: PrismaService) {}

  async create(createUserDto: CreateUserDto): Promise<UserEntity> {
    const { role, status, ...userData } = createUserDto;

    const existingUser = await this.db.user.findUnique({
      where: {
        email: createUserDto.email,
      },
    });

    if (existingUser) {
      throw new ConflictException('emailTaken');
    }

    if (createUserDto.password) {
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(createUserDto.password, salt);

      userData.password = hashedPassword;
    }

    const user = await this.db.user.create({
      data: {
        ...userData,
        role: role ? { connect: { id: role.id } } : undefined,
        status: status ? { connect: { id: status.id } } : undefined,
      },
    });

    await this.db.consent.create({
      data: {
        privacyPolicyAccepted: true,
        privacyPolicyVersion: '1.0',
        termsAccepted: true,
        termsVersion: '1.0',
        userId: user.id,
      },
    });

    return {
      ...user,
      role: {
        id: role.id,
        name: convertRoleIdToRoleNameEnum(role.id),
      },
      status: {
        id: user.statusId,
        name: convertStatusIdToNameEnum(user.statusId),
      },
    };
  }

  async findAll(page = 1, pageSize = 10) {
    const skip = (page - 1) * pageSize;
    const users = await this.db.user.findMany({
      include: {
        articles: true,
        consent: true,
        role: true,
        status: true,
      },
      take: pageSize,
      skip,
    });

    const usersWithLastConsent = await Promise.all(
      users.map(async (user) => {
        return {
          ...user,
          role: {
            id: user.role.id,
            name: convertRoleIdToRoleNameEnum(user.role.id),
          },
          status: {
            id: user.statusId,
            name: convertStatusIdToNameEnum(user.statusId),
          },
        };
      }),
    );

    return usersWithLastConsent;
  }

  findOneBySocialId(
    socialId: UserEntity['socialId'],
    provider: keyof typeof AuthProvidersEnum,
  ) {
    return this.db.user.findFirst({
      where: {
        socialId,
        provider,
      },
      include: {
        status: true,
        role: true,
        consent: true,
      },
    });
  }

  async findOneById<T = UserEntity>(
    id: UserEntity['id'],
    include?: Prisma.UserInclude,
  ): Promise<T> {
    const query: Prisma.UserFindUniqueArgs = { where: { id } };

    if (include) {
      query.include = include;
    }

    return this.db.user.findUnique(query) as unknown as Promise<T>;
  }

  async findOneByEmail<T = UserEntity>(
    email: UserEntity['email'],
    include?: Prisma.UserInclude,
  ): Promise<T> {
    const query: Prisma.UserFindUniqueArgs = { where: { email } };

    if (include) {
      query.include = include;
    }

    return this.db.user.findUnique(query) as unknown as Promise<T>;
  }

  async update(id: UserEntity['id'], updateUserDto: UpdateUserDto) {
    const { role, status, ...userData } = updateUserDto;
    if (updateUserDto.password) {
      const salt = await bcrypt.genSalt();
      userData.password = await bcrypt.hash(updateUserDto.password, salt);
    }

    if (updateUserDto.email) {
      const existingUser = await this.db.user.findUnique({
        where: {
          email: updateUserDto.email,
        },
      });
      if (existingUser) {
        throw new ConflictException('emailTaken');
      }
    }

    const user = await this.db.user.update({
      where: { id },
      include: {
        articles: true,
        consent: true,
        role: true,
        status: true,
      },
      data: {
        ...userData,
        role: role ? { connect: { id: role.id } } : undefined,
        status: status ? { connect: { id: status.id } } : undefined,
      },
    });

    return {
      ...user,
      role: {
        id: user.role.id,
        name: convertRoleIdToRoleNameEnum(user.role.id),
      },
      status: {
        id: user.status.id,
        name: convertStatusIdToNameEnum(user.status.id),
      },
    };
  }

  delete(id: UserEntity['id']) {
    return this.db.user.delete({ where: { id } });
  }
}
