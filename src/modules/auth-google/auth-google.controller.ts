import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  SerializeOptions,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';

import { AuthProvidersEnum } from '~starter/modules/auth/auth-providers.enum';
import { AuthService } from '~starter/modules/auth/auth.service';
import { AuthEntity } from '~starter/modules/auth/entity/auth.entity';
import { AuthGoogleService } from '~starter/modules/auth-google/auth-google.service';
import { AuthGoogleLoginDto } from '~starter/modules/auth-google/dto/auth-google-login.dto';
import { ErrorEntity } from '~starter/shared/errors/error-entity';
import { ErrorServerEntity } from '~starter/shared/errors/error-server-entity';
import { ErrorValidationEntity } from '~starter/shared/errors/error-validation';

@ApiTags('auth-social')
@Controller({
  path: 'auth/google',
  version: '1',
})
export class AuthGoogleController {
  constructor(
    private readonly authService: AuthService,
    private readonly authGoogleService: AuthGoogleService,
  ) {}

  @SerializeOptions({
    groups: ['me'],
  })
  @Post('login')
  @ApiOperation({
    summary: 'Login with Google',
    description: 'Logs the user into the system using Google authentication',
  })
  @HttpCode(HttpStatus.OK)
  @ApiCreatedResponse({
    description: 'Successfully logged in with Google',
    type: AuthEntity,
  })
  @ApiBadRequestResponse({
    description:
      'Bad Request - Error during Google token verification or processing',
    type: ErrorEntity,
  })
  @ApiUnprocessableEntityResponse({
    description: 'Unprocessable Entity - Invalid or expired Google token',
    type: ErrorEntity,
  })
  @ApiResponse({
    status: 422,
    description:
      'Validation Error - One or more fields did not pass validation',
    type: ErrorValidationEntity,
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error',
    type: ErrorServerEntity,
  })
  async login(@Body() loginDto: AuthGoogleLoginDto): Promise<AuthEntity> {
    const socialData = await this.authGoogleService.getProfileByToken(loginDto);

    return new AuthEntity(
      await this.authService.loginWithSocial(
        AuthProvidersEnum.google,
        socialData,
      ),
    );
  }
}
