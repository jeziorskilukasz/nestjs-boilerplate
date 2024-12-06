import { ApiProperty } from '@nestjs/swagger';

export class ErrorServerEntity {
  @ApiProperty({
    description: 'Type of error',
    example: 'Server Error',
  })
  error: string;

  @ApiProperty({
    description: 'HTTP status code indicating the error',
    example: 500,
  })
  statusCode: number;
}
