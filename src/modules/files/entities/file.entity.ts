import { ApiProperty } from '@nestjs/swagger';
import { Allow } from 'class-validator';

export class FileEntity {
  constructor(partial: Partial<FileEntity>) {
    Object.assign(this, partial);
  }

  @ApiProperty({
    example: 'cbcfa8b8-3a25-4adb-a9c6-e325f0d0f3ae',
    description: 'Unique identifier of the file',
  })
  @Allow()
  id: string;

  @ApiProperty({
    example: '/uploads/avatars/cbcfa8b8-3a25-4adb-a9c6-e325f0d0f3ae.png',
    description: 'Path to access the file',
  })
  @Allow()
  path: string;

  @ApiProperty({
    example: 'avatar',
    description: 'Category of the file',
    nullable: true,
  })
  @Allow()
  category?: string | null;

  @ApiProperty({
    example: '2024-02-27T12:34:56.789Z',
    description: 'Creation date of the file',
  })
  @Allow()
  createdAt: Date;

  @ApiProperty({ example: 'image/png', description: 'MIME type of the file' })
  @Allow()
  mimeType: string;

  @ApiProperty({
    example: 'profile-picture.png',
    description: 'Name of the file',
  })
  @Allow()
  name: string;

  @ApiProperty({ example: 102400, description: 'Size of the file in bytes' })
  @Allow()
  size: number;

  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Identifier of the user who owns the file',
  })
  @Allow()
  userId: string;
}
