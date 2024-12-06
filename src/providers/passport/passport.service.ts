import { randomUUID } from 'crypto';

import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import ms from 'ms';

import { AuthEntity } from '~starter/modules/auth/entity/auth.entity';
import { HashTypes } from '~starter/modules/auth/strategies/types/hash-type';
import { UserEntity } from '~starter/modules/users/entities/user.entity';
import { MailData } from '~starter/providers/mail/interfaces/mail-data.interface';
import { MailService } from '~starter/providers/mail/mail.service';
import { SessionService } from '~starter/session/session.service';

@Injectable()
export class PassportService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly sessionService: SessionService,
    private readonly mailService: MailService,
  ) {}

  async generateHashAndSendMail({
    additionalPayload = {},
    email,
    mailMethod,
    operationType,
    userId,
    userName,
  }: {
    additionalPayload?: Record<string, unknown>;
    email: UserEntity['email'];
    mailMethod: <T>(params: MailData<T>) => Promise<void>;
    operationType: HashTypes;
    userId: UserEntity['id'];
    userName: UserEntity['firstName'];
  }): Promise<void> {
    try {
      const expiresIn: string = this.configService.getOrThrow(
        `auth.${operationType}Expires`,
        { infer: true },
      );
      const secret = this.configService.getOrThrow(
        `auth.${operationType}Secret`,
        { infer: true },
      );

      const payload = {
        [`${operationType}UserId`]: userId,
        type: operationType,
        ...additionalPayload,
      };

      const hash = await this.jwtService.signAsync(payload, {
        secret,
        expiresIn,
      });

      await this.sessionService.createHashSession({
        expiresIn: ms(expiresIn) / 1000,
        hash,
        type: operationType,
        userId,
      });

      await mailMethod.call(this.mailService, {
        to: email,
        userName: userName || '',
        data: { hash },
      });
    } catch (error) {
      if (error instanceof Error) {
        throw new BadRequestException(error.message);
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async verifyAndProcessHash({
    hash,
    operationType,
    processMethod,
  }: {
    hash: string;
    operationType: HashTypes;
    processMethod: (userId: UserEntity['id'], payload?: any) => Promise<void>;
  }): Promise<void> {
    try {
      const secret = this.configService.getOrThrow(
        `auth.${operationType}Secret`,
        { infer: true },
      );

      const jwtOperation = `${operationType}UserId`;

      const jwtData = await this.jwtService.verifyAsync<{
        [key: typeof jwtOperation]: any;
        type: HashTypes;
      }>(hash, { secret });

      const decodeHash = this.jwtService.decode<{
        [key: typeof jwtOperation]: string;
        type: HashTypes;
      }>(hash);

      if (jwtData.type !== operationType) {
        throw new BadRequestException(
          'The provided hash code is of invalid type.',
        );
      }

      const hashSession = await this.sessionService.checkHashSession({
        userId: jwtData[jwtOperation],
        type: operationType,
      });

      const decodeSessionHash = this.jwtService.decode<{
        [key: typeof jwtOperation]: string;
        type: HashTypes;
      }>(hashSession);

      if (
        !hashSession ||
        hash !== hashSession ||
        decodeHash.type !== operationType ||
        decodeSessionHash.type !== decodeHash.type ||
        decodeSessionHash[jwtOperation] !== decodeHash[jwtOperation]
      ) {
        throw new BadRequestException(
          'The provided hash code is invalid. Please ensure you are using a valid hash code for the operation.',
        );
      }

      await this.sessionService.removeHashSession({
        userId: jwtData[jwtOperation],
        type: operationType,
      });

      await processMethod(jwtData[jwtOperation], jwtData);
    } catch (e) {
      throw new BadRequestException(
        'The provided hash code is invalid. Please ensure you are using a valid hash code for the operation.',
      );
    }
  }

  async getTokensData(data: {
    id: UserEntity['id'];
    role: UserEntity['role'];
    status: UserEntity['status'];
  }): Promise<Omit<AuthEntity, 'user'>> {
    const sessionId = randomUUID();
    const tokenExpiresIn: string = this.configService.getOrThrow(
      'auth.expires',
      {
        infer: true,
      },
    );

    const refreshTokenExpiresIn: string = this.configService.getOrThrow(
      'auth.refreshExpires',
      {
        infer: true,
      },
    );

    const tokenExpiresMs = ms(tokenExpiresIn);
    const tokenExpires = Date.now() + tokenExpiresMs;

    const refreshTokenExpiresMs = ms(refreshTokenExpiresIn);

    const [token, refreshToken] = await Promise.all([
      await this.jwtService.signAsync(
        {
          id: data.id,
          role: data.role,
          status: data.status,
          sessionId,
        },
        {
          secret: this.configService.getOrThrow('auth.secret', { infer: true }),
          expiresIn: tokenExpiresIn,
        },
      ),
      await this.jwtService.signAsync(
        {
          sessionId,
          id: data.id,
        },
        {
          secret: this.configService.getOrThrow('auth.refreshSecret', {
            infer: true,
          }),
          expiresIn: refreshTokenExpiresIn,
        },
      ),
    ]);

    const ttlToken = tokenExpiresMs / 1000;
    const ttlRefreshToken = refreshTokenExpiresMs / 1000;

    await this.sessionService.createSession({
      refreshToken,
      sessionId,
      token,
      ttlRefreshToken,
      ttlToken,
      userId: data?.id,
    });

    return {
      accessToken: token,
      refreshToken,
      tokenExpires,
    };
  }
}
