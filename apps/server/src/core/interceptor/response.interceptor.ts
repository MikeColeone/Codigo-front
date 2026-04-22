import type {
  ExecutionContext,
  NestInterceptor,
  CallHandler,
} from '@nestjs/common';
import type { Observable } from 'rxjs';
import { map } from 'rxjs';
import { Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { normalizeSuccessResponse } from 'src/shared/types/rest-vo';
import { SKIP_RESPONSE_WRAP_KEY } from './skip-response-wrap.decorator';
/**
 * 拦截成功返回的统一响应格式
 */
@Injectable()
export class ResponseIntercept implements NestInterceptor {
  constructor(private reflector: Reflector) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<any> {
    const shouldSkip = this.reflector.getAllAndOverride<boolean>(
      SKIP_RESPONSE_WRAP_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (shouldSkip) {
      return next.handle();
    }
    return next.handle().pipe(map((data) => normalizeSuccessResponse(data)));
  }
}
