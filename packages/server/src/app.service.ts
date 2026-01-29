import { Injectable } from '@nestjs/common';

import { test } from '@codigo/share';
@Injectable()
export class AppService {
  getHello(): string {
    return test;
  }
}
