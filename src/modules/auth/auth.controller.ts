import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
  Request,
  SerializeOptions,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiHeader,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
  ApiUnprocessableEntityResponse,
  ApiTooManyRequestsResponse,
  ApiForbiddenResponse,
  ApiResponse,
} from '@nestjs/swagger';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';

import { AuthService } from '~starter/modules/auth/auth.service';
import { AuthConfirmEmailChangeDto } from '~starter/modules/auth/dto/auth-confirm-email-change.dto';
import { AuthConfirmEmailDto } from '~starter/modules/auth/dto/auth-confirm-email.dto';
import { AuthEmailChangeDto } from '~starter/modules/auth/dto/auth-email-change.dto';
import { AuthEmailLoginDto } from '~starter/modules/auth/dto/auth-email-login.dto';
import { AuthRegisterLoginDto } from '~starter/modules/auth/dto/auth-email-register.dto';
import { AuthForgotPasswordDto } from '~starter/modules/auth/dto/auth-forgot-password.dto';
import { AuthResendVerificationEmailDto } from '~starter/modules/auth/dto/auth-resend-verification-email.dto';
import { AuthResetPasswordDto } from '~starter/modules/auth/dto/auth-reset-password.dto';
import { AuthUpdateDto } from '~starter/modules/auth/dto/auth-update.dto';
import { AuthEntity } from '~starter/modules/auth/entity/auth.entity';
import { RefreshEntity } from '~starter/modules/auth/entity/refresh.entity';
import { UserEntity } from '~starter/modules/users/entities/user.entity';
import { ErrorEntity } from '~starter/shared/errors/error-entity';
import { ErrorServerEntity } from '~starter/shared/errors/error-server-entity';
import { ErrorTooManyRequestsEntity } from '~starter/shared/errors/error-too-many-requests-entity';
import { ErrorUnauthorizedEntity } from '~starter/shared/errors/error-unauthorized-entity';
import { ErrorValidationEntity } from '~starter/shared/errors/error-validation';
import { Statuses } from '~starter/statuses/status.decorator';
import { StatusGuard } from '~starter/statuses/status.guard';
import { StatusEnum } from '~starter/statuses/statuses.enum';

@ApiTags('auth')
@Controller({
  path: 'auth',
  version: '1',
})
@ApiInternalServerErrorResponse({
  description: 'Internal server error',
  type: ErrorServerEntity,
})
export class AuthController {
  constructor(private readonly service: AuthService) {}

  @Post('email/login')
  @ApiOperation({
    summary: 'User Login',
    description: 'Logs the user into the system and returns access tokens',
  })
  @ApiCreatedResponse({ type: AuthEntity })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
    type: ErrorUnauthorizedEntity,
  })
  @ApiTooManyRequestsResponse({
    description: 'ThrottlerException: Too Many Requests',
    type: ErrorTooManyRequestsEntity,
  })
  @ApiForbiddenResponse({
    description: 'Please activate your account before proceeding',
    type: ErrorEntity,
  })
  @ApiResponse({
    status: 422,
    description:
      'Validation Error - One or more fields did not pass validation',
    type: ErrorValidationEntity,
  })
  @UseGuards(ThrottlerGuard)
  @Throttle({ default: { limit: 5, ttl: 30000 } })
  async login(@Body() loginDto: AuthEmailLoginDto): Promise<AuthEntity> {
    return new AuthEntity(await this.service.loginWithEmail(loginDto));
  }

  @Post('email/register')
  @ApiOperation({
    summary: 'User Registration',
    description: 'Registers a new user with email and password',
  })
  @ApiHeader({
    name: 'Accept-Language',
    description:
      'Specifies the preferred language for API responses. Supported values are: en (English), de (German), pl (Polish)',
    example: 'en',
    required: false,
  })
  @ApiCreatedResponse({ type: UserEntity })
  @ApiBadRequestResponse({
    description: 'Bad Request - Missing or invalid registration details',
  })
  @ApiTooManyRequestsResponse({
    description: 'ThrottlerException: Too Many Requests',
    type: ErrorTooManyRequestsEntity,
  })
  @ApiResponse({
    status: 422,
    description:
      'Validation Error - One or more fields did not pass validation',
    type: ErrorValidationEntity,
  })
  @UseGuards(ThrottlerGuard)
  @Throttle({ default: { limit: 5, ttl: 120000 } })
  async register(
    @Body() registerWithEmail: AuthRegisterLoginDto,
  ): Promise<UserEntity> {
    return new UserEntity(
      await this.service.registerWithEmail(registerWithEmail),
    );
  }

  @Post('email/confirm')
  @ApiOperation({
    summary: 'Confirm Email',
    description:
      "Confirms the user's email address using the provided confirmation hash.",
  })
  @ApiHeader({
    name: 'Accept-Language',
    description:
      'Specifies the preferred language for API responses. Supported values are: en (English), de (German), pl (Polish)',
    example: 'en',
    required: false,
  })
  @UseGuards(ThrottlerGuard)
  @Throttle({ default: { limit: 3, ttl: 60000 } })
  @HttpCode(HttpStatus.OK)
  @ApiBadRequestResponse({
    description: 'Bad Request - Invalid or expired hash code',
  })
  @ApiTooManyRequestsResponse({
    description: 'ThrottlerException: Too Many Requests',
    type: ErrorTooManyRequestsEntity,
  })
  @ApiResponse({
    status: 422,
    description:
      'Validation Error - One or more fields did not pass validation',
    type: ErrorValidationEntity,
  })
  async confirmEmail(
    @Body() confirmEmailDto: AuthConfirmEmailDto,
  ): Promise<void> {
    return this.service.confirmEmail(confirmEmailDto.hash);
  }

  @UseGuards(ThrottlerGuard)
  @Throttle({ default: { limit: 1, ttl: 30000 } })
  @Post('email/resend')
  @ApiOperation({
    summary: 'Resend Verification Email',
    description: "Resend the verification email to the user's email address.",
  })
  @ApiHeader({
    name: 'Accept-Language',
    description:
      'Specifies the preferred language for API responses. Supported values are: en (English), de (German), pl (Polish)',
    example: 'en',
    required: false,
  })
  @HttpCode(HttpStatus.OK)
  @ApiBadRequestResponse({
    description: 'Bad Request - Invalid email format',
    type: ErrorEntity,
  })
  @ApiTooManyRequestsResponse({
    description: 'ThrottlerException: Too Many Requests',
    type: ErrorTooManyRequestsEntity,
  })
  @ApiResponse({
    status: 422,
    description:
      'Validation Error - One or more fields did not pass validation',
    type: ErrorValidationEntity,
  })
  async resendVerificationEmail(
    @Body() resendVerificationEmailDto: AuthResendVerificationEmailDto,
  ): Promise<void> {
    return this.service.resendVerificationEmail(
      resendVerificationEmailDto.email,
    );
  }

  @Post('forgot/password')
  @ApiOperation({
    summary: 'Forgot Password',
    description:
      "Initiates the password reset process by sending an email with a reset link to the user's email address.",
  })
  @ApiHeader({
    name: 'Accept-Language',
    description:
      'Specifies the preferred language for API responses. Supported values are: en (English), de (German), pl (Polish)',
    example: 'en',
    required: false,
  })
  @UseGuards(ThrottlerGuard)
  @Throttle({ default: { limit: 1, ttl: 30000 } })
  @HttpCode(HttpStatus.OK)
  @ApiBadRequestResponse({
    description: 'Bad Request - Invalid email format',
    type: ErrorEntity,
  })
  @ApiTooManyRequestsResponse({
    description: 'ThrottlerException: Too Many Requests',
    type: ErrorTooManyRequestsEntity,
  })
  @ApiResponse({
    status: 422,
    description:
      'Validation Error - One or more fields did not pass validation',
    type: ErrorValidationEntity,
  })
  async forgotPassword(
    @Body() forgotPasswordDto: AuthForgotPasswordDto,
  ): Promise<void> {
    return this.service.forgotPassword(forgotPasswordDto.email);
  }

  @Post('reset/password')
  @UseGuards(ThrottlerGuard)
  @Throttle({ default: { limit: 5, ttl: 30000 } })
  @ApiOperation({
    summary: 'Reset Password',
    description:
      "Resets the user's password using the provided reset password hash.",
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBadRequestResponse({
    description: 'Bad Request - Invalid or expired hash code',
    type: ErrorEntity,
  })
  @ApiTooManyRequestsResponse({
    description: 'ThrottlerException: Too Many Requests',
    type: ErrorTooManyRequestsEntity,
  })
  @ApiResponse({
    status: 422,
    description:
      'Validation Error - One or more fields did not pass validation',
    type: ErrorValidationEntity,
  })
  resetPassword(@Body() resetPasswordDto: AuthResetPasswordDto): Promise<void> {
    return this.service.resetPassword(
      resetPasswordDto.hash,
      resetPasswordDto.password,
    );
  }

  @ApiBearerAuth()
  @Post('email/change')
  @ApiOperation({
    summary: 'Initialize Email Change',
    description:
      "Initiates the process to change the user's email address. After initialization, the user must confirm the email address change through another endpoint.",
  })
  @ApiHeader({
    name: 'Accept-Language',
    description:
      'Specifies the preferred language for API responses. Supported values are: en (English), de (German), pl (Polish)',
    example: 'en',
    required: false,
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBadRequestResponse({
    description: 'Bad Request - Invalid or expired hash code',
    type: ErrorEntity,
  })
  @ApiTooManyRequestsResponse({
    description: 'ThrottlerException: Too Many Requests',
    type: ErrorTooManyRequestsEntity,
  })
  @ApiResponse({
    status: 422,
    description:
      'Validation Error - One or more fields did not pass validation',
    type: ErrorValidationEntity,
  })
  @Statuses(StatusEnum.active)
  @UseGuards(AuthGuard('jwt'), ThrottlerGuard, StatusGuard)
  @Throttle({ default: { limit: 5, ttl: 30000 } })
  emailChange(
    @Body() emailChangeDto: AuthEmailChangeDto,
    @Request() request,
  ): Promise<void> {
    return this.service.emailChange(emailChangeDto?.email, request?.user?.id);
  }

  @ApiBearerAuth()
  @Post('email/change-confirm')
  @UseGuards(ThrottlerGuard)
  @Throttle({ default: { limit: 2, ttl: 30000 } })
  @ApiOperation({
    summary: 'Confirm Email Change',
    description:
      "Confirms the change of a user's email address using a verification code sent to the new email. This endpoint validates the verification code (hash) received by the user to complete the email address change process.",
  })
  @ApiHeader({
    name: 'Accept-Language',
    description:
      'Specifies the preferred language for API responses. Supported values are: en (English), de (German), pl (Polish)',
    example: 'en',
    required: false,
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBadRequestResponse({
    description: 'Bad Request - Invalid or expired hash code',
    type: ErrorEntity,
  })
  @ApiTooManyRequestsResponse({
    description: 'ThrottlerException: Too Many Requests',
    type: ErrorTooManyRequestsEntity,
  })
  confirmEmailChange(
    @Body() confirmEmailChangeDto: AuthConfirmEmailChangeDto,
  ): Promise<void> {
    return this.service.confirmEmailChange(confirmEmailChangeDto.hash);
  }

  @ApiBearerAuth()
  @SerializeOptions({
    groups: ['me'],
  })
  @Get('me')
  @ApiOperation({
    summary: 'Get Current User',
    description: 'Retrieves information about the current authenticated user',
  })
  @UseGuards(AuthGuard('jwt'))
  @ApiCreatedResponse({ type: UserEntity })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
    type: ErrorUnauthorizedEntity,
  })
  public async me(@Request() request): Promise<UserEntity> {
    return new UserEntity(await this.service.me(request.user));
  }

  @ApiBearerAuth()
  @Statuses(StatusEnum.active)
  @UseGuards(AuthGuard('jwt'), StatusGuard)
  @SerializeOptions({
    groups: ['me'],
  })
  @Patch('me')
  @ApiOperation({
    summary: 'Update Current User',
    description: 'Updates information about the current authenticated user',
  })
  @HttpCode(HttpStatus.OK)
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
    type: ErrorUnauthorizedEntity,
  })
  @ApiUnprocessableEntityResponse({
    description:
      'Missing old password / Incorrect old password / Missing password',
    type: ErrorEntity,
  })
  @ApiResponse({
    status: 422,
    description:
      'Validation Error - One or more fields did not pass validation',
    type: ErrorValidationEntity,
  })
  @ApiNotFoundResponse({ description: 'User not found' })
  public async update(
    @Request() request,
    @Body() userDto: AuthUpdateDto,
  ): Promise<UserEntity> {
    return new UserEntity(await this.service.update(request.user, userDto));
  }

  @ApiBearerAuth()
  @SerializeOptions({
    groups: ['me'],
  })
  @Post('refresh')
  @ApiOperation({
    summary: 'Refresh Access Token',
    description: 'Refreshes the access token using the refresh token',
  })
  @UseGuards(AuthGuard('jwt-refresh'))
  @HttpCode(HttpStatus.OK)
  @ApiCreatedResponse({ type: RefreshEntity })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
    type: ErrorUnauthorizedEntity,
  })
  public refresh(@Request() request): Promise<Omit<AuthEntity, 'user'>> {
    return this.service.refreshToken({
      sessionId: request.user.sessionId,
      id: request.user.id,
    });
  }

  @ApiBearerAuth()
  @Post('logout')
  @ApiOperation({
    summary: 'Logout',
    description: 'Logs the user out of the system',
  })
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
    type: ErrorUnauthorizedEntity,
  })
  public async logout(@Request() request): Promise<void> {
    await this.service.logout({
      sessionId: request.user.sessionId,
      id: request.user.id,
    });
  }

  @ApiBearerAuth()
  @Post('logout/all')
  @ApiOperation({
    summary: 'Logout all sessions',
    description:
      'Logs the user out of all active sessions to enhance security in case of unauthorized access or when changing sensitive account information like passwords',
  })
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
    type: ErrorUnauthorizedEntity,
  })
  public async logoutAll(@Request() request): Promise<void> {
    await this.service.logoutAll({
      id: request.user.id,
    });
  }

  @ApiBearerAuth()
  @Delete('me')
  @ApiOperation({
    summary: 'Delete Current User',
    description: 'Deletes the current authenticated user',
  })
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
    type: ErrorUnauthorizedEntity,
  })
  public async delete(@Request() request): Promise<void> {
    return this.service.delete(request.user);
  }
}
