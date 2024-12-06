import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import gplay from 'google-play-scraper';
import { lastValueFrom } from 'rxjs';

import { AllConfigType } from '~starter/config/config.type';
import { CheckUpdateDto } from '~starter/modules/system/dto/check-update.dto';
import { AppVersionStatusEntity } from '~starter/modules/system/entities/app-version-status.entity';

type AppVersion = {
  version: string;
  currentVersionReleaseDate: Date;
};

@Injectable()
export class SystemService {
  constructor(
    private httpService: HttpService,
    private configService: ConfigService<AllConfigType>,
  ) {}

  private async fetchVersionFromAppStore(
    bundleId: string,
  ): Promise<AppVersion> {
    try {
      const response = await lastValueFrom(
        this.httpService.get(
          `https://itunes.apple.com/lookup?bundleId=${bundleId}`,
        ),
      );
      const results = response?.data?.results[0];
      const appData = {
        version: results?.version || null,
        currentVersionReleaseDate:
          new Date(results?.currentVersionReleaseDate) || null,
      };
      if (!appData.version || !appData.currentVersionReleaseDate) {
        throw new Error('App not found in App Store');
      }
      return appData;
    } catch (error) {
      throw new Error(
        `Failed to fetch version from App Store: ${error.message}`,
      );
    }
  }

  private async fetchVersionFromPlayStore(
    bundleId: string,
  ): Promise<AppVersion> {
    try {
      const appData = await gplay.app({ appId: bundleId });

      if (!appData.version || !appData.updated) {
        throw new Error('App not found in Google Play Store');
      }
      return {
        version: appData.version || null,
        currentVersionReleaseDate: new Date(appData.updated) || null,
      };
    } catch (error) {
      throw new Error(
        `Failed to fetch version from PlayStore: ${error.message}`,
      );
    }
  }

  async checkForApplicationUpdate({
    os,
    currentVersion,
  }: CheckUpdateDto): Promise<AppVersionStatusEntity> {
    return new Promise(async (resolve) => {
      const appleAppId = this.configService.getOrThrow('system.iosBundleId', {
        infer: true,
      });

      const androidAppId = this.configService.getOrThrow(
        'system.androidBundleId',
        {
          infer: true,
        },
      );
      const forceUpdatePeriod = this.configService.getOrThrow(
        'system.defaultForceUpdatePeriod',
        {
          infer: true,
        },
      );

      const IS_ANDROID = os === 'android';
      const minimumVersion = '19.02.1';

      const appInfo: AppVersion = IS_ANDROID
        ? await this.fetchVersionFromPlayStore(androidAppId)
        : await this.fetchVersionFromAppStore(appleAppId);

      const toDays = 1000 * 3600 * 24;

      const timeDifference: number = Math.round(
        (new Date(Date.now()).getTime() -
          new Date(appInfo.currentVersionReleaseDate).getTime()) /
          toDays,
      );

      const parseAppVersion = (version: string): number =>
        parseInt(version.replaceAll('.', ''));

      resolve({
        appId: IS_ANDROID ? androidAppId : appleAppId,
        currentVersionReleaseDate: appInfo.currentVersionReleaseDate,
        latestVersion: appInfo.version,
        minimumVersion,
        updateRequired:
          (timeDifference >= forceUpdatePeriod &&
            currentVersion !== appInfo.version) ||
          parseAppVersion(currentVersion) < parseAppVersion(minimumVersion),
      });
    });
  }
}
