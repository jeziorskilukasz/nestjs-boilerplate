import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import {
  IsDate,
  IsMimeType,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

import { FileEntity } from '~starter/modules/files/entities/file.entity';

export class FileDto implements FileEntity {
  @ApiProperty({
    example: 'cbcfa8b8-3a25-4adb-a9c6-e325f0d0f3ae',
    description: 'Unique identifier of the file',
  })
  @IsUUID()
  id: string;

  @ApiProperty({
    example: '/uploads/avatars/cbcfa8b8-3a25-4adb-a9c6-e325f0d0f3ae.png',
    description: 'Path to access the file',
  })
  @IsString()
  path: string;

  @ApiProperty({
    example: 'avatar',
    description: 'Category of the file',
    required: false,
  })
  @IsOptional()
  @IsString()
  category?: string | null;

  @ApiProperty({
    example: '2024-02-27T12:34:56.789Z',
    description: 'File creation date',
  })
  @IsDate()
  createdAt: Date;

  @ApiProperty({ example: 'image/png', description: 'MIME type of the file' })
  @IsMimeType()
  mimeType: string;

  @ApiProperty({
    example: 'profile-picture.png',
    description: 'Name of the file',
  })
  @IsString()
  name: string;

  @ApiProperty({ example: 102400, description: 'Size of the file in bytes' })
  @IsNumber()
  size: number;

  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Identifier of the user who owns the file',
  })
  @IsUUID()
  userId: string;

  @Exclude()
  file: {
    category?: string;
    createdAt?: Date;
    id?: string;
    mimeType?: string;
    name?: string;
    path?: string;
    size?: number;
    userId?: string;
  };
}
