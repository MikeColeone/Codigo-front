import { Controller, Post, Body, UseGuards, Get, Query } from '@nestjs/common';
import type {
  PostReleaseRequest,
  PostQuestionDataRequest,
} from '@codigo/schema';
import { AuthGuard } from '@nestjs/passport';
import { PageAnalyticsService } from 'src/modules/flow/service/page-analytics.service';
import { PageReleaseService } from 'src/modules/flow/service/page-release.service';
import {
  GetUserAgent,
  GetUserIP,
  getUserMess,
} from 'src/shared/helpers/current-user.helper';
import type { TCurrentUser } from 'src/shared/helpers/current-user.helper';
import { SecretTool } from 'src/shared/utils/secret.tool';

@Controller('low_code')
export class LegacyLowCodeController {
  constructor(
    private readonly secretTool: SecretTool,
    private readonly pageReleaseService: PageReleaseService,
    private readonly pageAnalyticsService: PageAnalyticsService,
  ) {}

  @Post('release')
  @UseGuards(AuthGuard('jwt'))
  release(@Body() body: PostReleaseRequest, @getUserMess() user: TCurrentUser) {
    return this.pageReleaseService.release(body, user);
  }

  @Get('release_with_user')
  @UseGuards(AuthGuard('jwt'))
  getReleaseDataWithUser(@getUserMess() user: TCurrentUser) {
    return this.pageReleaseService.getReleaseData(null, user);
  }

  @Get('release')
  getReleaseData(@Query() query: { id: number }) {
    return this.pageReleaseService.getReleaseData(query.id);
  }

  @Get('is_question_data_posted')
  isQuestionDataPosted(
    @Query() query: { page_id: number },
    @GetUserIP() ip: string,
    @GetUserAgent() agent: string,
  ) {
    const key = this.resolveSubmissionKey(ip, agent);
    return this.pageAnalyticsService.isQuestionDataPosted(key, query.page_id);
  }

  @Post('question_data')
  postQuestionData(
    @Body() body: PostQuestionDataRequest,
    @GetUserIP() ip: string,
    @GetUserAgent() agent: string,
  ) {
    const key = this.resolveSubmissionKey(ip, agent);
    return this.pageAnalyticsService.postQuestionData(body, key);
  }

  @Get('question_components')
  @UseGuards(AuthGuard('jwt'))
  getQuestionComponents(@getUserMess() user: TCurrentUser) {
    return this.pageAnalyticsService.getQuestionComponents(user);
  }

  @Get('question_data')
  @UseGuards(AuthGuard('jwt'))
  getQuestionData(@getUserMess() user: TCurrentUser) {
    return this.pageAnalyticsService.getQuestionData(user.id);
  }

  @Post('get_question_data_by_id')
  @UseGuards(AuthGuard('jwt'))
  getQuestionDataByTypeRequest(
    @getUserMess() user: TCurrentUser,
    @Body() body: { id: number },
  ) {
    return this.pageAnalyticsService.getQuestionDataByIdRequest({
      ...body,
      userId: user.id,
    });
  }

  private resolveSubmissionKey(ip: string, agent: string) {
    return this.secretTool.getSecret(ip + agent);
  }
}
