import { ApiProperty } from '@nestjs/swagger';

class ValidationErrorDetail {
  @ApiProperty({
    description: 'Message describing the validation error for the field',
    example: 'Invalid email format.',
  })
  message: string;
}

export class ErrorValidationEntity {
  @ApiProperty({
    description: 'HTTP status code indicating the error',
    example: 422,
  })
  statusCode: number;

  @ApiProperty({
    description: 'Object containing field-specific validation errors',
    example: { email: 'Invalid email format.' },
    type: 'object',
    additionalProperties: {
      type: 'string',
    },
  })
  errors: Record<string, ValidationErrorDetail | string>;

  constructor(
    statusCode: number,
    errors: Record<string, ValidationErrorDetail | string>,
  ) {
    this.statusCode = statusCode;
    this.errors = errors;
  }
}
