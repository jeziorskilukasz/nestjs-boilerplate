import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { ConsentService } from '~starter/consent/consent.service';
import { AuthProvidersEnum } from '~starter/modules/auth/auth-providers.enum';
import { AuthEmailLoginDto } from '~starter/modules/auth/dto/auth-email-login.dto';
import { AuthRegisterLoginDto } from '~starter/modules/auth/dto/auth-email-register.dto';
import { AuthUpdateDto } from '~starter/modules/auth/dto/auth-update.dto';
import { AuthEntity } from '~starter/modules/auth/entity/auth.entity';
import { JwtPayloadType } from '~starter/modules/auth/strategies/types/jwt-payload.type';
import { JwtRefreshPayloadType } from '~starter/modules/auth/strategies/types/jwt-refresh-payload.type';
import { FilesService } from '~starter/modules/files/files.service';
import { UserEntity } from '~starter/modules/users/entities/user.entity';
import { UsersService } from '~starter/modules/users/users.service';
import { MailService } from '~starter/providers/mail/mail.service';
import { PassportService } from '~starter/providers/passport/passport.service';
import {
  convertRoleIdToRoleNameEnum,
  convertToRoleNameEnum,
} from '~starter/roles/roles.decorator';
import { RoleIdEnum } from '~starter/roles/roles.enum';
import { SessionService } from '~starter/session/session.service';
import { SocialInterface } from '~starter/social/interfaces/social.interface';
import { convertStatusIdToNameEnum } from '~starter/statuses/status.decorator';
import { StatusEnum, StatusNameEnum } from '~starter/statuses/statuses.enum';

@Injectable()
export class AuthService {
  constructor(
    private consentService: ConsentService,
    private filesService: FilesService,
    private mailService: MailService,
    private sessionService: SessionService,
    private userService: UsersService,
    private passportService: PassportService,
  ) {}

  async loginWithEmail(loginDto: AuthEmailLoginDto): Promise<AuthEntity> {
    const existingUser = await this.userService.findOneByEmail(loginDto.email, {
      status: true,
    });

    if (!existingUser) {
      throw new UnauthorizedException();
    }

    if (existingUser?.status?.name === StatusNameEnum.inactive) {
      throw new ForbiddenException(
        'Please activate your account before proceeding.',
      );
    }

    const user = await this.userService.findOneByEmail(loginDto.email, {
      role: true,
      status: true,
      consent: true,
    });

    if (!user?.password || user?.provider !== AuthProvidersEnum.email) {
      throw new UnauthorizedException();
    }

    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException();
    }

    const { accessToken, refreshToken, tokenExpires } =
      await this.passportService.getTokensData({
        id: user.id,
        role: user.role,
        status: user.status,
      });

    return {
      refreshToken,
      accessToken,
      tokenExpires,
      user,
    };
  }

  async loginWithSocial(
    authProvider: keyof typeof AuthProvidersEnum,
    socialData: SocialInterface,
  ): Promise<AuthEntity> {
    let user: UserEntity = null;
    const socialEmail = socialData.email?.toLowerCase()?.trim();
    let userByEmail: UserEntity = null;

    if (socialEmail) {
      userByEmail = await this.userService.findOneByEmail(socialEmail);
    }

    if (socialData?.id) {
      const socialUser = await this.userService.findOneBySocialId(
        socialData.id,
        authProvider,
      );

      if (socialUser?.id) {
        const existingSocialUser = {
          ...socialUser,
          status: {
            ...socialUser.status,
            name: convertStatusIdToNameEnum(socialUser.status.id),
          },
          role: {
            ...socialUser.role,
            name: convertToRoleNameEnum(socialUser.role.name),
          },
        };
        user = existingSocialUser;
      }
    }

    if (user) {
      if (socialEmail && !userByEmail) {
        user.email = socialEmail;
      }
      await this.userService.update(user.id, {
        email: user?.email,
        firstName: user?.firstName,
        lastName: user?.lastName,
        provider: authProvider,
      });
    } else if (userByEmail) {
      user = userByEmail;
    } else {
      user = await this.userService.create({
        email: socialEmail ?? null,
        firstName: socialData.firstName ?? null,
        lastName: socialData.lastName ?? null,
        locale: 'us-US',
        provider: authProvider,
        role: { id: RoleIdEnum.user },
        socialId: socialData.id,
        status: { id: StatusEnum.active },
      });

      if (socialEmail) {
        await this.mailService.welcomeEmail({
          to: socialEmail,
          userName: socialData.firstName ?? '',
          data: {} as never,
        });
      }

      user = await this.userService.findOneById(user?.id);
    }

    if (!user) {
      throw new NotFoundException();
    }

    const {
      accessToken: jwtToken,
      refreshToken,
      tokenExpires,
    } = await this.passportService.getTokensData({
      id: user.id,
      role: user.role,
      status: user.status,
    });

    return {
      accessToken: jwtToken,
      refreshToken,
      tokenExpires,
      user,
    };
  }

  async registerWithEmail(
    registerWithEmailDto: AuthRegisterLoginDto,
  ): Promise<UserEntity> {
    delete registerWithEmailDto.termsAccepted;
    delete registerWithEmailDto.privacyPolicyAccepted;

    const user = await this.userService.create({
      ...registerWithEmailDto,
      password: registerWithEmailDto.password,
      provider: AuthProvidersEnum.email,
      role: {
        id: RoleIdEnum.user,
      },
      status: {
        id: StatusEnum.inactive,
      },
      socialId: null,
      locale: registerWithEmailDto.locale,
    });

    await this.passportService.generateHashAndSendMail({
      additionalPayload: {},
      email: user.email,
      mailMethod: this.mailService.userSignUp.bind(this.mailService),
      operationType: 'confirmEmail',
      userId: user.id,
      userName: user.firstName || '',
    });

    return user;
  }

  async confirmEmail(hash: string): Promise<void> {
    await this.passportService.verifyAndProcessHash({
      hash,
      operationType: 'confirmEmail',
      processMethod: async (userId: UserEntity['id']) => {
        const user = await this.userService.findOneById(userId);
        if (!user || user.statusId !== StatusEnum.inactive) {
          throw new BadRequestException(
            'The provided hash code has expired or has been already used.',
          );
        }

        await this.userService.update(user.id, {
          status: {
            id: StatusEnum.active,
          },
        });

        await this.mailService.welcomeEmail({
          to: user.email,
          userName: user.firstName,
          data: {} as never,
        });
      },
    });
  }

  async resendVerificationEmail(email: UserEntity['email']): Promise<void> {
    try {
      const user = await this.userService.findOneByEmail(email, {
        status: true,
      });

      if (
        !user ||
        user.status.name === StatusNameEnum.active ||
        user.provider !== AuthProvidersEnum.email
      ) {
        return;
      }

      await this.passportService.generateHashAndSendMail({
        additionalPayload: {},
        email: user.email,
        mailMethod: this.mailService.userSignUp.bind(this.mailService),
        operationType: 'confirmEmail',
        userId: user.id,
        userName: user.firstName || '',
      });
    } catch (error) {
      if (error instanceof Error) {
        throw new BadRequestException(error.message);
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async forgotPassword(email: string): Promise<void> {
    try {
      const user = await this.userService.findOneByEmail(email);

      if (!user || user.provider !== AuthProvidersEnum.email) {
        return;
      }

      await this.passportService.generateHashAndSendMail({
        userId: user.id,
        email: user.email,
        userName: user.firstName || '',
        operationType: 'forgotPassword',
        mailMethod: this.mailService.forgotPassword.bind(this.mailService),
        additionalPayload: {},
      });
    } catch (error) {
      if (error instanceof Error) {
        throw new BadRequestException(error.message);
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async emailChange(
    newEmail: UserEntity['email'],
    id: UserEntity['id'],
  ): Promise<void> {
    try {
      const user = await this.userService.findOneById(id);
      const existingUser = await this.userService.findOneByEmail(newEmail);

      if (user?.email === newEmail) {
        throw new BadRequestException(
          'The new email address must be different from the current one. Please provide a different email address to proceed with the change.',
        );
      }

      if (user.provider !== AuthProvidersEnum.email || existingUser) {
        throw new BadRequestException();
      }

      await this.passportService.generateHashAndSendMail({
        userId: user.id,
        email: newEmail,
        userName: user.firstName || '',
        operationType: 'changeEmail',
        mailMethod: this.mailService.changeEmail.bind(this.mailService),
        additionalPayload: {
          oldEmail: user.email,
          newEmail,
        },
      });
    } catch (error) {
      if (error instanceof Error) {
        throw new BadRequestException(error.message);
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async confirmEmailChange(hash: string): Promise<void> {
    await this.passportService.verifyAndProcessHash({
      hash,
      operationType: 'changeEmail',
      processMethod: async (userId: UserEntity['id'], payload: any) => {
        const newEmail = payload.newEmail;
        const user = await this.userService.findOneById(userId);

        if (!user) {
          throw new BadRequestException('User not found.');
        }

        if (user.email === newEmail) {
          throw new BadRequestException(
            'New email address cannot be the same as the current one.',
          );
        }

        await this.userService.update(user.id, {
          email: newEmail,
        });

        await this.mailService.confirmEmailChange({
          to: newEmail,
          userName: user.firstName,
          data: {} as never,
        });
      },
    });
  }

  async resetPassword(hash: string, password: string): Promise<void> {
    await this.passportService.verifyAndProcessHash({
      hash,
      operationType: 'forgotPassword',
      processMethod: async (userId) => {
        const user = await this.userService.findOneById(userId);
        if (!user) {
          throw new BadRequestException();
        }

        await this.userService.update(user.id, { password });
      },
    });
  }

  async me(userJwtPayload: JwtPayloadType): Promise<UserEntity> {
    return await this.userService.findOneById(userJwtPayload.id, {
      role: true,
      status: true,
      consent: true,
    });
  }

  async update(
    userJwtPayload: JwtPayloadType,
    userDto: AuthUpdateDto,
  ): Promise<UserEntity> {
    const currentUser = await this.userService.findOneById(userJwtPayload.id, {
      status: true,
    });

    if (!currentUser) {
      throw new NotFoundException();
    }

    if (userDto.password || userDto.oldPassword) {
      if (
        (!userDto.oldPassword && userDto.password) ||
        (userDto.oldPassword && !userDto.password)
      ) {
        throw new UnprocessableEntityException(
          !userDto.oldPassword ? `missingOldPassword` : `missingPassword`,
        );
      }

      if (!currentUser.password) {
        throw new UnprocessableEntityException('missingPassword');
      }

      const isValidOldPassword = await bcrypt.compare(
        userDto.oldPassword,
        currentUser.password,
      );

      if (!isValidOldPassword) {
        throw new UnprocessableEntityException('incorrectOldPassword');
      } else {
        await this.sessionService.logoutOtherSessions(
          currentUser.id,
          userJwtPayload.id,
        );
      }
      if (userDto.oldPassword) {
        delete userDto.oldPassword;
      }
    }

    await this.userService.update(userJwtPayload.id, userDto);

    return this.userService.findOneById(userJwtPayload.id, {
      role: true,
      status: true,
      consent: true,
    });
  }

  async refreshToken(
    data: Pick<JwtRefreshPayloadType, 'sessionId' | 'id'>,
  ): Promise<Omit<AuthEntity, 'user'>> {
    const session = await this.sessionService.getRefreshSession(data.sessionId);

    if (!session) {
      throw new UnauthorizedException();
    }

    const user = await this.userService.findOneById(data.id);

    const { accessToken, refreshToken, tokenExpires } =
      await this.passportService.getTokensData({
        id: user.id,
        role: {
          id: user.roleId,
          name: convertRoleIdToRoleNameEnum(user.roleId),
        },
        status: {
          id: user.statusId,
          name: convertStatusIdToNameEnum(user.statusId),
        },
      });

    await this.sessionService.logoutSession(user.id, data.sessionId);

    return {
      accessToken,
      refreshToken,
      tokenExpires,
    };
  }

  async logout(data: Pick<JwtRefreshPayloadType, 'sessionId' | 'id'>) {
    const sessionId = data.sessionId;
    const userId = data.id;

    await this.sessionService.logoutSession(userId, sessionId);
  }

  async logoutAll(data: Pick<JwtRefreshPayloadType, 'id'>) {
    await this.sessionService.logoutAllSessions(data.id);
  }

  async delete(
    user: Pick<UserEntity, 'id'> & JwtRefreshPayloadType,
  ): Promise<void> {
    if (!user && !user?.id) {
      throw new UnauthorizedException();
    }

    const dbUser = await this.userService.findOneById(user.id);

    if (!dbUser) {
      throw new UnauthorizedException();
    }

    const id = dbUser.id;
    const to = dbUser.email;
    const userName = dbUser?.firstName || '';

    await this.sessionService.logoutAllSessions(id);

    await this.consentService.deleteMany(id);
    await this.filesService.deleteMany(id);
    await this.userService.delete(id);

    await this.mailService.deleteAccount({
      to,
      userName,
      data: {
        id,
      },
    });
  }
}
