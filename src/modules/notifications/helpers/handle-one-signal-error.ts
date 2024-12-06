import {
  InternalServerErrorException,
  BadRequestException,
  UnauthorizedException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';

/**
 * Handle errors from OneSignal and map them to appropriate HTTP exceptions.
 * @param error The error object from OneSignal.
 */
export function handleOneSignalError(error: any): never {
  const statusCode = error.code || 500;
  let message: string = 'Unknown error';
  if (error.response) {
    if (typeof error.response.data === 'string') {
      try {
        const parsedData = JSON.parse(error.response.data);
        message = parsedData.errors?.join(', ') || error.message || message;
      } catch (parseError) {
        message = error.response.data || message;
      }
    } else if (error.response.data?.errors) {
      message = error.response.data.errors.join(', ');
    }
  } else if (error.message) {
    const match = error.message.match(/Body: ({.*})/);
    if (match) {
      try {
        const parsedBody = JSON.parse(match[1]);
        message = parsedBody.errors?.join(', ') || error.message || message;
      } catch (parseError) {
        message = match[1];
      }
    }
  }

  switch (statusCode) {
    case 400:
      throw new BadRequestException(`OneSignal Error: ${message}`);
    case 401:
      throw new UnauthorizedException(`OneSignal Error: ${message}`);
    case 403:
      throw new ForbiddenException(`OneSignal Error: ${message}`);
    case 404:
      throw new NotFoundException(`OneSignal Error: ${message}`);
    case 429:
      throw new BadRequestException(`OneSignal Error: ${message}`);
    default:
      throw new InternalServerErrorException(`OneSignal Error: ${message}`);
  }
}
