import { HttpStatus } from '@api/routes/index.router';

export class NotFoundException {
  constructor(...objectError: any[]) {
    throw {
      status: HttpStatus.NOT_FOUND,
      error: 'Not Found',
      message: objectError.length > 0 ? objectError : undefined,
    };
  }
}
