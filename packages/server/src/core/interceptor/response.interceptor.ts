import type {
  ExecutionContext,
  NestInterceptor,
  CallHandler,
} from '@nestjs/common';
import type { Observable } from 'rxjs';
import { map } from 'rxjs';
import { Injectable } from '@nestjs/common';
import { normalizeSuccessResponse } from 'src/shared/types/rest-vo';
/**
 * 拦截�?成功返回的统⼀响应格式
 */
@Injectable()
export class ResponseIntercept implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ReturnType<typeof normalizeSuccessResponse>> {
    void context;
    return next.handle().pipe(map((data) => normalizeSuccessResponse(data)));
  }
}
