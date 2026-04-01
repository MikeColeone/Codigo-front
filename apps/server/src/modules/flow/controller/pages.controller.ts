import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Put,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import type {
  PageWorkspaceIDEConfigResponse,
  PageWorkspaceExplorerResponse,
  PageWorkspaceFileResponse,
  PageWorkspaceResponse,
  PageWorkspaceRuntimeResponse,
  PageWorkspaceSessionResponse,
  PostQuestionDataRequest,
  PostReleaseRequest,
  PutPageWorkspaceFileRequest,
  PutPageWorkspaceFileResponse,
} from '@codigo/schema';
import {
  GetUserAgent,
  GetUserIP,
  getUserMess,
} from 'src/shared/helpers/current-user.helper';
import type { TCurrentUser } from 'src/shared/helpers/current-user.helper';
import { OpenSumiConfigService } from 'src/modules/flow/service/opensumi-config.service';
import { PageAnalyticsService } from 'src/modules/flow/service/page-analytics.service';
import { PageReleaseService } from 'src/modules/flow/service/page-release.service';
import { WorkspaceExplorerService } from 'src/modules/flow/service/workspace-explorer.service';
import { WorkspaceRuntimeService } from 'src/modules/flow/service/workspace-runtime.service';
import { WorkspaceSessionService } from 'src/modules/flow/service/workspace-session.service';
import { WorkspaceService } from 'src/modules/flow/service/workspace.service';
import { SecretTool } from 'src/shared/utils/secret.tool';

@Controller('pages')
export class PagesController {
  constructor(
    private readonly secretTool: SecretTool,
    private readonly pageReleaseService: PageReleaseService,
    private readonly pageAnalyticsService: PageAnalyticsService,
    private readonly openSumiConfigService: OpenSumiConfigService,
    private readonly workspaceExplorerService: WorkspaceExplorerService,
    private readonly workspaceService: WorkspaceService,
    private readonly workspaceRuntimeService: WorkspaceRuntimeService,
    private readonly workspaceSessionService: WorkspaceSessionService,
  ) {}

  @Put('me')
  @UseGuards(AuthGuard('jwt'))
  upsertMyPage(
    @Body() body: PostReleaseRequest,
    @getUserMess() user: TCurrentUser,
  ) {
    return this.pageReleaseService.release(body, user);
  }

  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  getMyPage(@getUserMess() user: TCurrentUser) {
    return this.pageReleaseService.getMyReleaseData(user);
  }

  @Get('public')
  getPublicPages() {
    return this.pageReleaseService.getPublicPageList();
  }

  @Get(':id')
  getPage(@Param('id', ParseIntPipe) id: number) {
    return this.pageReleaseService.getReleaseData(id);
  }

  @Get(':id/versions')
  @UseGuards(AuthGuard('jwt'))
  getPageVersions(
    @Param('id', ParseIntPipe) id: number,
    @getUserMess() user: TCurrentUser,
  ) {
    return this.pageReleaseService.getPageVersions(id, user);
  }

  @Get(':id/versions/:versionId')
  @UseGuards(AuthGuard('jwt'))
  getPageVersionDetail(
    @Param('id', ParseIntPipe) id: number,
    @Param('versionId') versionId: string,
    @getUserMess() user: TCurrentUser,
  ) {
    return this.pageReleaseService.getPageVersionDetail(id, versionId, user);
  }

  @Get(':id/workspace')
  @UseGuards(AuthGuard('jwt'))
  getPageWorkspace(
    @Param('id', ParseIntPipe) id: number,
    @getUserMess() user: TCurrentUser,
  ): Promise<PageWorkspaceResponse> {
    return this.workspaceService.getPageWorkspace(id, user);
  }

  @Post(':id/workspace')
  @UseGuards(AuthGuard('jwt'))
  syncPageWorkspace(
    @Param('id', ParseIntPipe) id: number,
    @getUserMess() user: TCurrentUser,
  ): Promise<PageWorkspaceResponse> {
    return this.workspaceService.syncPageWorkspace(id, user);
  }

  @Get(':id/workspace/session')
  @UseGuards(AuthGuard('jwt'))
  getPageWorkspaceSession(
    @Param('id', ParseIntPipe) id: number,
    @getUserMess() user: TCurrentUser,
  ): Promise<PageWorkspaceSessionResponse> {
    return this.workspaceSessionService.getPageWorkspaceSession(id, user);
  }

  @Post(':id/workspace/session')
  @UseGuards(AuthGuard('jwt'))
  startPageWorkspaceSession(
    @Param('id', ParseIntPipe) id: number,
    @getUserMess() user: TCurrentUser,
  ): Promise<PageWorkspaceSessionResponse> {
    return this.workspaceSessionService.startPageWorkspaceSession(id, user);
  }

  @Get(':id/workspace/runtime')
  @UseGuards(AuthGuard('jwt'))
  getPageWorkspaceRuntime(
    @Param('id', ParseIntPipe) id: number,
    @getUserMess() user: TCurrentUser,
  ): Promise<PageWorkspaceRuntimeResponse> {
    return this.workspaceRuntimeService.getPageWorkspaceRuntime(id, user);
  }

  @Post(':id/workspace/runtime')
  @UseGuards(AuthGuard('jwt'))
  startPageWorkspaceRuntime(
    @Param('id', ParseIntPipe) id: number,
    @getUserMess() user: TCurrentUser,
  ): Promise<PageWorkspaceRuntimeResponse> {
    return this.workspaceRuntimeService.startPageWorkspaceRuntime(id, user);
  }

  @Delete(':id/workspace/runtime')
  @UseGuards(AuthGuard('jwt'))
  stopPageWorkspaceRuntime(@Param('id', ParseIntPipe) id: number) {
    return this.workspaceRuntimeService.stopPageWorkspaceRuntime(id);
  }

  @Get(':id/workspace/ide-config')
  @UseGuards(AuthGuard('jwt'))
  getPageWorkspaceIDEConfig(
    @Param('id', ParseIntPipe) id: number,
    @getUserMess() user: TCurrentUser,
  ): Promise<PageWorkspaceIDEConfigResponse> {
    return this.openSumiConfigService.getPageWorkspaceIDEConfig(id, user);
  }

  @Post(':id/workspace/ide-config')
  @UseGuards(AuthGuard('jwt'))
  startPageWorkspaceIDEConfig(
    @Param('id', ParseIntPipe) id: number,
    @getUserMess() user: TCurrentUser,
  ): Promise<PageWorkspaceIDEConfigResponse> {
    return this.openSumiConfigService.startPageWorkspaceIDEConfig(id, user);
  }

  @Get(':id/workspace/explorer')
  @UseGuards(AuthGuard('jwt'))
  getPageWorkspaceExplorer(
    @Param('id', ParseIntPipe) id: number,
    @getUserMess() user: TCurrentUser,
  ): Promise<PageWorkspaceExplorerResponse> {
    return this.workspaceExplorerService.getPageWorkspaceExplorer(id, user);
  }

  @Get(':id/workspace/file')
  @UseGuards(AuthGuard('jwt'))
  getPageWorkspaceFile(
    @Param('id', ParseIntPipe) id: number,
    @Query('path') path: string,
    @getUserMess() user: TCurrentUser,
  ): Promise<PageWorkspaceFileResponse> {
    return this.workspaceExplorerService.getPageWorkspaceFile(id, user, path);
  }

  @Put(':id/workspace/file')
  @UseGuards(AuthGuard('jwt'))
  savePageWorkspaceFile(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: PutPageWorkspaceFileRequest,
    @getUserMess() user: TCurrentUser,
  ): Promise<PutPageWorkspaceFileResponse> {
    return this.workspaceExplorerService.savePageWorkspaceFile(
      id,
      user,
      body.path,
      body.content,
    );
  }

  @Get(':id/submissions/me')
  isMySubmissionPosted(
    @Param('id', ParseIntPipe) pageId: number,
    @GetUserIP() ip: string,
    @GetUserAgent() agent: string,
  ) {
    const key = this.resolveSubmissionKey(ip, agent);
    return this.pageAnalyticsService.isQuestionDataPosted(key, pageId);
  }

  @Post(':id/submissions')
  postSubmission(
    @Param('id', ParseIntPipe) pageId: number,
    @Body() body: Pick<PostQuestionDataRequest, 'props'>,
    @GetUserIP() ip: string,
    @GetUserAgent() agent: string,
  ) {
    const key = this.resolveSubmissionKey(ip, agent);
    return this.pageAnalyticsService.postQuestionData(
      { page_id: pageId, ...body },
      key,
    );
  }

  @Get('me/analytics/components')
  @UseGuards(AuthGuard('jwt'))
  getAnalyticsComponents(@getUserMess() user: TCurrentUser) {
    return this.pageAnalyticsService.getQuestionComponents(user);
  }

  @Get('me/analytics/submissions')
  @UseGuards(AuthGuard('jwt'))
  getAnalyticsSubmissions(@getUserMess() user: TCurrentUser) {
    return this.pageAnalyticsService.getQuestionData(user.id);
  }

  @Get('me/analytics/components/:componentId/submissions')
  @UseGuards(AuthGuard('jwt'))
  getAnalyticsSubmissionsByComponent(
    @getUserMess() user: TCurrentUser,
    @Param('componentId', ParseIntPipe) componentId: number,
  ) {
    return this.pageAnalyticsService.getQuestionDataByIdRequest({
      id: componentId,
      userId: user.id,
    });
  }

  private resolveSubmissionKey(ip: string, agent: string) {
    return this.secretTool.getSecret(ip + agent);
  }
}
