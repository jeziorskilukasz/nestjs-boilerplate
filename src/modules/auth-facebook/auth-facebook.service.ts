import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Facebook } from 'fb';

import { AllConfigType } from '~starter/config/config.type';
import { AuthFacebookLoginDto } from '~starter/modules/auth-facebook/dto/auth-facebook-login.dto';
import { FacebookInterface } from '~starter/modules/auth-facebook/interfaces/facebook.interface';
import { SocialInterface } from '~starter/social/interfaces/social.interface';

@Injectable()
export class AuthFacebookService {
  constructor(private configService: ConfigService<AllConfigType>) {}

  async getProfileByToken(
    loginDto: AuthFacebookLoginDto,
  ): Promise<SocialInterface> {
    const fb: Facebook = new Facebook({
      appId: this.configService.get('facebook.appId', {
        infer: true,
      }),
      appSecret: this.configService.get('facebook.appSecret', {
        infer: true,
      }),
      version: 'v7.0',
    });
    fb.setAccessToken(loginDto.accessToken);

    const data: FacebookInterface = await new Promise((resolve) => {
      fb.api(
        '/me',
        'get',
        { fields: 'id,last_name,email,first_name' },
        (response) => {
          resolve(response);
        },
      );
    });

    if (!data.email) {
      throw new BadRequestException(
        'Email permission is probably missing. Please ensure the email scope is included in your Facebook login permissions. For more details on handling permissions, please refer to the Facebook permissions documentation: https://developers.facebook.com/docs/permissions',
      );
    }

    return {
      id: data.id,
      email: data.email,
      firstName: data?.first_name || '',
      lastName: data?.last_name || '',
    };
  }
}
