import {
  Controller,
  Body,
  BadRequestException,
  InternalServerErrorException,
  UseGuards,
  Post,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiResponse,
  ApiTags,
  ApiTooManyRequestsResponse,
} from '@nestjs/swagger';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';

import { CheckUpdateDto } from '~starter/modules/system/dto/check-update.dto';
import { AppVersionStatusEntity } from '~starter/modules/system/entities/app-version-status.entity';
import { SystemService } from '~starter/modules/system/system.service';
import { ErrorServerEntity } from '~starter/shared/errors/error-server-entity';
import { ErrorTooManyRequestsEntity } from '~starter/shared/errors/error-too-many-requests-entity';
import { ErrorValidationEntity } from '~starter/shared/errors/error-validation';
@Controller({
  path: 'system',
  version: '1',
})
@ApiTags('system')
@ApiInternalServerErrorResponse({
  description: 'Internal server error',
  type: ErrorServerEntity,
})
export class SystemController {
  constructor(private readonly systemService: SystemService) {}

  @ApiResponse({
    status: 201,
    description:
      'Details about application from AppStore or PlayStore based on provided os',
    type: AppVersionStatusEntity,
  })
  @ApiBadRequestResponse({
    description: 'Bad Request - Missing or invalid app details',
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
  @Post('app-updates/check')
  @UseGuards(ThrottlerGuard)
  @Throttle({ default: { limit: 5, ttl: 30000 } })
  checkForAppUpdate(
    @Body() checkSystemDto: CheckUpdateDto,
  ): Promise<AppVersionStatusEntity> {
    try {
      return this.systemService.checkForApplicationUpdate(checkSystemDto);
    } catch (e) {
      if (e instanceof Error) {
        throw new BadRequestException(e.message);
      } else {
        throw new InternalServerErrorException();
      }
    }
  }
}
