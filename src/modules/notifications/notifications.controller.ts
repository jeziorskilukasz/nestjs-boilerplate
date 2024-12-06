import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiTooManyRequestsResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';

import { AppDto } from '~starter/modules/notifications/dto/app.dto';
import { CreateAppDto } from '~starter/modules/notifications/dto/create-app.dto';
import { CreateNotificationDto } from '~starter/modules/notifications/dto/create-notification.dto';
import { NotificationHistoryResponseDto } from '~starter/modules/notifications/dto/notification-history-response.dto';
import { GetNotificationHistoryDto } from '~starter/modules/notifications/dto/notification-history.dto';
import { NotificationSlice } from '~starter/modules/notifications/dto/notification-slice.dto';
import { NotificationWithMeta } from '~starter/modules/notifications/dto/notification-with-meta.dto';
import { UpdateAppDto } from '~starter/modules/notifications/dto/update-app.dto';
import { UserNotificationEntity } from '~starter/modules/notifications/entities/user-notification.entity';
import { NotificationService } from '~starter/modules/notifications/notifications.service';
import { Roles } from '~starter/roles/roles.decorator';
import { RoleIdEnum } from '~starter/roles/roles.enum';
import { RolesGuard } from '~starter/roles/roles.guard';
import { ErrorEntity } from '~starter/shared/errors/error-entity';
import { ErrorServerEntity } from '~starter/shared/errors/error-server-entity';
import { ErrorUnauthorizedEntity } from '~starter/shared/errors/error-unauthorized-entity';
import { ErrorValidationEntity } from '~starter/shared/errors/error-validation';
import { Statuses } from '~starter/statuses/status.decorator';
import { StatusGuard } from '~starter/statuses/status.guard';
import { StatusEnum } from '~starter/statuses/statuses.enum';

@ApiTags('notifications')
@Statuses(StatusEnum.active)
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard, StatusGuard)
@UseGuards(ThrottlerGuard)
@Controller({
  path: 'notifications',
  version: '1',
})
@ApiInternalServerErrorResponse({
  description: 'Internal server error',
  type: ErrorServerEntity,
})
@ApiTooManyRequestsResponse({
  description: 'ThrottlerException: Too Many Requests',
})
@ApiUnauthorizedResponse({
  description: 'Unauthorized',
  type: ErrorUnauthorizedEntity,
})
@ApiForbiddenResponse({
  description: 'Forbidden',
  type: ErrorEntity,
})
@ApiResponse({
  status: 422,
  description: 'Validation Error - One or more fields did not pass validation',
  type: ErrorValidationEntity,
})
export class NotificationsController {
  constructor(private readonly service: NotificationService) {}

  // -------------------- User Routes --------------------

  @Post('user')
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @ApiOperation({ summary: 'Create a new user' })
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({ type: UserNotificationEntity })
  @ApiBadRequestResponse({ type: ErrorEntity })
  async createUser(
    @Body('externalId') externalId: string,
  ): Promise<UserNotificationEntity> {
    return this.service.createUser(externalId);
  }

  @Delete('user/:aliasLabel/:aliasId')
  @Throttle({ default: { limit: 3, ttl: 60000 } })
  @ApiOperation({ summary: 'Delete a user' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteUser(
    @Param('aliasLabel') aliasLabel: string,
    @Param('aliasId') aliasId: string,
  ): Promise<void> {
    await this.service.deleteUser(aliasLabel, aliasId);
  }

  @Patch('user/:aliasLabel/:aliasId')
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @ApiOperation({ summary: 'Update a user' })
  @HttpCode(HttpStatus.OK)
  @ApiCreatedResponse({ type: UserNotificationEntity })
  async updateUser(
    @Param('aliasLabel') aliasLabel: string,
    @Param('aliasId') aliasId: string,
    @Body('properties')
    properties: Partial<UserNotificationEntity['properties']>,
  ): Promise<Partial<UserNotificationEntity>> {
    return this.service.updateUser(aliasLabel, aliasId, {
      properties,
    });
  }

  // -------------------- Notification Routes --------------------

  @Post('notification')
  @Roles(RoleIdEnum.admin)
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @ApiOperation({ summary: 'Create a notification' })
  @ApiCreatedResponse({ description: 'Notification created successfully' })
  @ApiBadRequestResponse({ description: 'Invalid data provided' })
  async createNotification(
    @Body() createNotificationDto: CreateNotificationDto,
  ) {
    return this.service.createNotification(createNotificationDto);
  }

  @Get('notification')
  @Roles(RoleIdEnum.admin)
  @Throttle({ default: { limit: 15, ttl: 60000 } })
  @ApiOperation({ summary: 'List notifications' })
  async listNotifications(
    @Query('limit') limit?: number,
    @Query('offset') offset?: number,
    @Query('kind') kind?: 0 | 1 | 3,
  ): Promise<NotificationSlice> {
    return this.service.listNotifications(limit, offset, kind);
  }

  @Get('notification/:id')
  @Roles(RoleIdEnum.admin)
  @Throttle({ default: { limit: 15, ttl: 60000 } })
  @ApiOperation({ summary: 'View a notification' })
  async viewNotification(
    @Param('id') id: string,
  ): Promise<NotificationWithMeta> {
    return this.service.viewNotification(id);
  }

  @Get('notification/:id/history')
  @Roles(RoleIdEnum.admin)
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @ApiOperation({
    summary: 'Get notification history',
    description: 'Fetch the history of a specific notification',
  })
  async getHistory(
    @Param('id') id: string,
    @Body() historyDto: GetNotificationHistoryDto,
  ): Promise<NotificationHistoryResponseDto> {
    return this.service.getNotificationHistory(id, historyDto);
  }

  // -------------------- App Routes --------------------

  @Post('app')
  @Roles(RoleIdEnum.admin)
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @ApiOperation({ summary: 'Create a new app' })
  @ApiCreatedResponse({ description: 'App created successfully', type: AppDto })
  @ApiBadRequestResponse({ description: 'Invalid data provided' })
  async createApp(@Body() createAppDto: CreateAppDto): Promise<AppDto> {
    return this.service.createApp(createAppDto);
  }

  @Put('app/:id')
  @Roles(RoleIdEnum.admin)
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @ApiOperation({ summary: 'Update an existing app' })
  @ApiCreatedResponse({
    description: 'App updated successfully',
    type: AppDto,
  })
  @ApiBadRequestResponse({ description: 'Invalid data provided' })
  async updateApp(
    @Param('id') id: string,
    @Body() updateAppDto: UpdateAppDto,
  ): Promise<AppDto> {
    return this.service.updateApp(id, updateAppDto);
  }

  @Get('app/:id')
  @Roles(RoleIdEnum.admin)
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @ApiOperation({ summary: 'Fetch details of a specific app' })
  @ApiCreatedResponse({ description: 'Fetched app details', type: AppDto })
  async getApp(@Param('id') id: string): Promise<AppDto> {
    return this.service.getApp(id);
  }

  @Get('app')
  @Roles(RoleIdEnum.admin)
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @ApiOperation({ summary: 'List all apps' })
  @ApiCreatedResponse({
    description: 'Fetched list of all apps',
    type: [AppDto],
  })
  async getApps(): Promise<AppDto[]> {
    return this.service.getApps();
  }
}
