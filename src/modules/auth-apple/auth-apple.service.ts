import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import appleSigninAuth from 'apple-signin-auth';
import { AllConfigType } from 'src/config/config.type';

import { AuthAppleLoginDto } from '~starter/modules/auth-apple/dto/auth-apple-login.dto';
import { SocialInterface } from '~starter/social/interfaces/social.interface';

@Injectable()
export class AuthAppleService {
  constructor(private configService: ConfigService<AllConfigType>) {}

  async getProfileByToken(
    loginDto: AuthAppleLoginDto,
  ): Promise<SocialInterface> {
    try {
      const audience = this.configService.get('apple.appAudience', {
        infer: true,
      });

      const data = await appleSigninAuth.verifyIdToken(loginDto.idToken, {
        audience,
      });

      if (!data?.email) {
        throw new BadRequestException(
          'Email permission is probably missing. Please ensure the email scope is included in your Apple config permissions. For more details on handling permissions, please refer to the permissions documentation: https://developer.apple.com/documentation/sign_in_with_apple/sign_in_with_apple_rest_api/authenticating_users_with_sign_in_with_apple',
        );
      }

      return {
        id: data.sub,
        email: data.email,
        firstName: loginDto?.firstName,
        lastName: loginDto?.lastName,
      };
    } catch (err) {
      if (err instanceof Error) {
        throw new BadRequestException(err.message);
      } else {
        throw new InternalServerErrorException();
      }
    }
  }
}
