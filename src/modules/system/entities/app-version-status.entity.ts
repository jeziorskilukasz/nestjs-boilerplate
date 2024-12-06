import { ApiProperty } from '@nestjs/swagger';
export class AppVersionStatusEntity {
  @ApiProperty({
    example: '1.5.0',
    description: 'The latest version of the app available in the app store.',
  })
  latestVersion: string;

  @ApiProperty({
    example: '1.0.0',
    description:
      'The minimum version of the app that still functions correctly without mandatory updates.',
  })
  minimumVersion: string;

  @ApiProperty({
    example: true,
    description:
      'Indicates whether an update is required to continue using the app.',
  })
  updateRequired: boolean;

  @ApiProperty({
    example: 'com.example.com',
    description:
      'AppId of application in AppStore(AppStore Bundle ID) or PlayStore(Google Play Store app ID)',
  })
  appId: string;

  @ApiProperty({
    example: '2.0.0',
    description: 'The current version of the app.',
  })
  currentVersionReleaseDate: Date;
}
