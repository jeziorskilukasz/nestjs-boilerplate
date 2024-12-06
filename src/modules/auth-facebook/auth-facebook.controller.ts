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
import { AuthFacebookService } from '~starter/modules/auth-facebook/auth-facebook.service';
import { AuthFacebookLoginDto } from '~starter/modules/auth-facebook/dto/auth-facebook-login.dto';
import { ErrorEntity } from '~starter/shared/errors/error-entity';
import { ErrorServerEntity } from '~starter/shared/errors/error-server-entity';
import { ErrorValidationEntity } from '~starter/shared/errors/error-validation';

@ApiTags('auth-social')
@Controller({
  path: 'auth/facebook',
  version: '1',
})
export class AuthFacebookController {
  constructor(
    private readonly authService: AuthService,
    private readonly authFacebookService: AuthFacebookService,
  ) {}

  @SerializeOptions({
    groups: ['me'],
  })
  @Post('login')
  @ApiOperation({
    summary: 'Login with Facebook',
    description: 'Logs the user into the system using Facebook authentication',
  })
  @HttpCode(HttpStatus.OK)
  @ApiCreatedResponse({
    description: 'Successfully logged in with Facebook',
    type: AuthEntity,
  })
  @ApiBadRequestResponse({
    description:
      'Bad Request - Error during Facebook token verification or processing',
    type: ErrorEntity,
  })
  @ApiUnprocessableEntityResponse({
    description: 'Unprocessable Entity - Invalid or expired Facebook token',
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
  async login(@Body() loginDto: AuthFacebookLoginDto): Promise<AuthEntity> {
    const socialData =
      await this.authFacebookService.getProfileByToken(loginDto);

    return new AuthEntity(
      await this.authService.loginWithSocial(
        AuthProvidersEnum.facebook,
        socialData,
      ),
    );
  }
}
