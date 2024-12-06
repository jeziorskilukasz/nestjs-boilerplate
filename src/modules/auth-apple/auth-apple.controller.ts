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
import { AuthAppleService } from '~starter/modules/auth-apple/auth-apple.service';
import { AuthAppleLoginDto } from '~starter/modules/auth-apple/dto/auth-apple-login.dto';
import { ErrorEntity } from '~starter/shared/errors/error-entity';
import { ErrorServerEntity } from '~starter/shared/errors/error-server-entity';
import { ErrorValidationEntity } from '~starter/shared/errors/error-validation';

@ApiTags('auth-social')
@Controller({
  path: 'auth/apple',
  version: '1',
})
export class AuthAppleController {
  constructor(
    private readonly authService: AuthService,
    private readonly authAppleService: AuthAppleService,
  ) {}

  @SerializeOptions({
    groups: ['me'],
  })
  @Post('login')
  @ApiOperation({
    summary: 'Login with Apple',
    description: 'Logs the user into the system using Apple authentication',
  })
  @HttpCode(HttpStatus.OK)
  @ApiCreatedResponse({
    description: 'Successfully logged in with Apple',
    type: AuthEntity,
  })
  @ApiBadRequestResponse({
    description:
      'Bad Request - Error during Apple token verification or processing',
    type: ErrorEntity,
  })
  @ApiUnprocessableEntityResponse({
    description: 'Unprocessable Entity - Invalid or expired Apple token',
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
  async login(@Body() loginDto: AuthAppleLoginDto): Promise<AuthEntity> {
    const socialData = await this.authAppleService.getProfileByToken(loginDto);

    return new AuthEntity(
      await this.authService.loginWithSocial(
        AuthProvidersEnum.apple,
        socialData,
      ),
    );
  }
}
