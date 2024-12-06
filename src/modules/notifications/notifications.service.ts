import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as OneSignal from '@onesignal/node-onesignal';

import { AppDto } from './dto/app.dto';

import { AllConfigType } from '~starter/config/config.type';
import { CreateAppDto } from '~starter/modules/notifications/dto/create-app.dto';
import { NotificationHistoryResponseDto } from '~starter/modules/notifications/dto/notification-history-response.dto';
import { GetNotificationHistoryDto } from '~starter/modules/notifications/dto/notification-history.dto';
import { NotificationSlice } from '~starter/modules/notifications/dto/notification-slice.dto';
import { NotificationWithMeta } from '~starter/modules/notifications/dto/notification-with-meta.dto';
import { UpdateAppDto } from '~starter/modules/notifications/dto/update-app.dto';
import { UserNotificationEntity } from '~starter/modules/notifications/entities/user-notification.entity';
import { convertLanguageStringMap } from '~starter/modules/notifications/helpers/convert-language-string-map';
import { handleOneSignalError } from '~starter/modules/notifications/helpers/handle-one-signal-error';

@Injectable()
export class NotificationService {
  private readonly client: OneSignal.DefaultApi;
  private readonly appId: string;

  constructor(private configService: ConfigService<AllConfigType>) {
    const notificationRestApiKey = this.configService.getOrThrow(
      'notification.apiKey',
      {
        infer: true,
      },
    );

    const notificationUserAuthKey = this.configService.getOrThrow(
      'notification.userKey',
      {
        infer: true,
      },
    );

    const notificationAppId = this.configService.getOrThrow(
      'notification.appId',
      {
        infer: true,
      },
    );

    this.appId = notificationAppId;

    const configuration = OneSignal.createConfiguration({
      userAuthKey: notificationUserAuthKey,
      restApiKey: notificationRestApiKey,
    });

    this.client = new OneSignal.DefaultApi(configuration);
  }

  /**
   * Create a new user in OneSignal.
   * @param externalId External identifier of the user.
   * @returns UserNotificationEntity containing user data.
   */
  async createUser(externalId: string): Promise<UserNotificationEntity> {
    const user = new OneSignal.User();
    user.identity = { external_id: externalId };

    try {
      const result = await this.client.createUser(this.appId, user);

      return new UserNotificationEntity({
        identity: result.identity || {},
        properties: result.properties || {},
        subscriptions: result.subscriptions || [],
      });
    } catch (error) {
      throw new InternalServerErrorException(
        `Unable to create user: ${error.message}`,
      );
    }
  }

  /**
   * Delete an existing user in OneSignal.
   * @param aliasLabel Alias label for the user (e.g., "external_id").
   * @param aliasId Alias ID of the user to delete.
   */
  async deleteUser(aliasLabel: string, aliasId: string): Promise<void> {
    try {
      await this.client.deleteUser(this.appId, aliasLabel, aliasId);
    } catch (error) {
      return handleOneSignalError(error);
    }
  }

  /**
   * Update an existing user in OneSignal.
   * @param aliasLabel Alias label for the user (e.g., "external_id").
   * @param aliasId Alias ID of the user to update.
   * @param updates Properties to update for the user.
   * @returns Updated properties object.
   */
  async updateUser(
    aliasLabel: string,
    aliasId: string,
    updates: { properties: Partial<UserNotificationEntity['properties']> },
  ): Promise<Partial<UserNotificationEntity>> {
    try {
      this.client.createNotification;
      const result = await this.client.updateUser(
        this.appId,
        aliasLabel,
        aliasId,
        {
          properties: updates.properties,
        },
      );

      return {
        properties: result.properties || {},
      };
    } catch (error) {
      return handleOneSignalError(error);
    }
  }

  /**
   * Create a new notification.
   * @param notification Notification data.
   */
  async createNotification(
    notification: Partial<OneSignal.Notification>,
  ): Promise<OneSignal.CreateNotificationSuccessResponse> {
    try {
      const result = await this.client.createNotification({
        ...notification,
        app_id: this.appId,
      });
      return result;
    } catch (error) {
      return handleOneSignalError(error);
    }
  }

  /**
   * List notifications.
   * @param limit Number of notifications to retrieve.
   * @param offset Pagination offset.
   * @param kind Type of notifications to retrieve.
   */
  async listNotifications(
    limit?: number,
    offset?: number,
    kind?: 0 | 1 | 3,
  ): Promise<NotificationSlice> {
    try {
      const result = await this.client.getNotifications(
        this.appId,
        limit,
        offset,
        kind,
      );

      return {
        total_count: result.total_count,
        offset: result.offset,
        limit: result.limit,
        notifications: result.notifications?.map((n) => ({
          id: n.id || '',
          contents: convertLanguageStringMap(n.contents),
          successful: n.successful || 0,
          failed: n.failed || 0,
          name: n.name || '',
        })),
      };
    } catch (error) {
      return handleOneSignalError(error);
    }
  }
  /**
   * View details of a specific notification.
   * @param notificationId ID of the notification.
   */
  async viewNotification(
    notificationId: string,
  ): Promise<NotificationWithMeta> {
    try {
      const result = await this.client.getNotification(
        this.appId,
        notificationId,
      );

      return {
        id: result.id || '',
        contents: convertLanguageStringMap(result.contents),
        successful: result.successful || 0,
        failed: result.failed || 0,
        name: result.name || '',
      };
    } catch (error) {
      return handleOneSignalError(error);
    }
  }

  /**
   * Fetches the history of a specific notification.
   *
   * @param {string} notificationId - The unique identifier of the notification.
   * @param {GetNotificationHistoryDto} historyDto - The DTO containing filters for the history request.
   * @returns {Promise<NotificationHistoryResponseDto>} A promise that resolves to the notification history details.
   * @throws {InternalServerErrorException} If the request fails due to an error.
   */
  async getNotificationHistory(
    notificationId: string,
    historyDto: GetNotificationHistoryDto,
  ): Promise<NotificationHistoryResponseDto> {
    try {
      const result = await this.client.getNotificationHistory(
        notificationId,
        historyDto,
      );

      return {
        success: result.success,
        destination_url: result.destination_url,
      };
    } catch (error) {
      return handleOneSignalError(error);
    }
  }

  /**
   * Creates a new app with the provided details.
   *
   * @param {CreateAppDto} createAppDto - The data transfer object containing the app creation details.
   * @returns {Promise<AppDto>} A promise that resolves to the created app details.
   * @throws {InternalServerErrorException} If the app creation fails.
   */
  async createApp(createAppDto: CreateAppDto): Promise<AppDto> {
    try {
      return await this.client.createApp(createAppDto);
    } catch (error) {
      return handleOneSignalError(error);
    }
  }

  /**
   * Updates an existing app with the provided details.
   *
   * @param {string} appId - The unique identifier of the app to update.
   * @param {UpdateAppDto} updateAppDto - The data transfer object containing the updated app details.
   * @returns {Promise<AppDto>} A promise that resolves to the updated app details.
   * @throws {InternalServerErrorException} If the app update fails.
   */
  async updateApp(appId: string, updateAppDto: UpdateAppDto): Promise<AppDto> {
    try {
      return await this.client.updateApp(appId, updateAppDto);
    } catch (error) {
      return handleOneSignalError(error);
    }
  }

  /**
   * Fetches the details of a specific app by its ID.
   *
   * @param {string} appId - The unique identifier of the app to fetch.
   * @returns {Promise<AppDto>} A promise that resolves to the app details.
   * @throws {InternalServerErrorException} If fetching the app details fails.
   */
  async getApp(appId: string): Promise<AppDto> {
    try {
      return await this.client.getApp(appId);
    } catch (error) {
      return handleOneSignalError(error);
    }
  }

  /**
   * Fetches a list of all apps.
   *
   * @returns {Promise<AppDto[]>} A promise that resolves to a list of app details.
   * @throws {InternalServerErrorException} If fetching the apps fails.
   */
  async getApps(): Promise<AppDto[]> {
    try {
      return await this.client.getApps();
    } catch (error) {
      return handleOneSignalError(error);
    }
  }
}
