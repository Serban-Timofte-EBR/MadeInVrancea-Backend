import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Made in Vrancea API — see /api/docs for documentation.';
  }

  health() {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }
}
