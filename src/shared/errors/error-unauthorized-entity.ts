import { ApiProperty } from '@nestjs/swagger';

export class ErrorUnauthorizedEntity {
  @ApiProperty({
    description: 'Type of error',
    example: 'Unauthorized',
  })
  error: string;

  @ApiProperty({
    description: 'HTTP status code indicating the error',
    example: 401,
  })
  statusCode: number;
}
