import { ApiProperty } from '@nestjs/swagger';

export class ErrorTooManyRequestsEntity {
  @ApiProperty({
    description: 'Type of error',
    example: 'ThrottlerException: Too Many Requests',
  })
  error: string;

  @ApiProperty({
    description: 'HTTP status code indicating the error',
    example: 429,
  })
  statusCode: number;
}
