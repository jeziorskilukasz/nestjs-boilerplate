import { ApiProperty } from '@nestjs/swagger';

export class ErrorEntity {
  @ApiProperty({
    description: 'Message describing the error',
    example: 'An error occurred while processing your request',
  })
  message?: string;

  @ApiProperty({
    description: 'Type of error',
    example: 'Forbidden',
  })
  error: string;

  @ApiProperty({
    description: 'HTTP status code indicating the error',
    example: 403,
  })
  statusCode: number;
}
