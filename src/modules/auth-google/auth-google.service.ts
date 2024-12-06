import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { google, Auth } from 'googleapis';

import { AllConfigType } from '~starter/config/config.type';
import { AuthGoogleLoginDto } from '~starter/modules/auth-google/dto/auth-google-login.dto';
import { SocialInterface } from '~starter/social/interfaces/social.interface';

@Injectable()
export class AuthGoogleService {
  private oauthClient: Auth.OAuth2Client;

  constructor(private configService: ConfigService<AllConfigType>) {
    this.oauthClient = new google.auth.OAuth2(
      configService.get('google.clientId', { infer: true }),
      configService.get('google.clientSecret', { infer: true }),
    );
  }

  async getProfileByToken(
    loginDto: AuthGoogleLoginDto,
  ): Promise<SocialInterface> {
    try {
      const userInfoClient = google.oauth2('v2').userinfo;

      this.oauthClient.setCredentials({
        access_token: loginDto.accessToken,
      });

      const userInfoResponse = await userInfoClient.get({
        auth: this.oauthClient,
      });

      const data = userInfoResponse?.data;

      if (!data) {
        throw new UnprocessableEntityException('tokenVerificationFailed');
      }

      return {
        email: data.email,
        firstName: data.given_name,
        id: data.id,
        lastName: data.family_name,
      };
    } catch (e) {
      if (e instanceof Error) {
        throw new BadRequestException(e.message);
      } else {
        throw new InternalServerErrorException();
      }
    }
  }
}
