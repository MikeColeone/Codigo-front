import { Module } from '@nestjs/common';
import { CollaborationController } from 'src/modules/flow/controller/collaboration.controller';
import { LegacyLowCodeController } from 'src/modules/flow/controller/low-code.controller';
import { PagesController } from 'src/modules/flow/controller/pages.controller';
import { CollaborationGateway } from 'src/modules/flow/gateway/collaboration.gateway';
import {
  Component,
  ComponentData,
  Page,
} from 'src/modules/flow/entity/low-code.entity';
import { PageCollaborator } from 'src/modules/flow/entity/page-collaborator.entity';
import { OperationLog } from 'src/modules/flow/entity/operation-log.entity';
import { PageVersion } from 'src/modules/flow/entity/page-version.entity';
import { CollaborationService } from 'src/modules/flow/service/collaboration.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OpenSumiConfigService } from 'src/modules/flow/service/opensumi-config.service';
import { PageAnalyticsService } from 'src/modules/flow/service/page-analytics.service';
import { PageReleaseService } from 'src/modules/flow/service/page-release.service';
import { WorkspaceExplorerService } from 'src/modules/flow/service/workspace-explorer.service';
import { WorkspaceService } from 'src/modules/flow/service/workspace.service';
import { WorkspaceRuntimeService } from 'src/modules/flow/service/workspace-runtime.service';
import { WorkspaceSessionService } from 'src/modules/flow/service/workspace-session.service';
import { User } from 'src/modules/user/entity/user.entity';
import { SecretTool } from 'src/shared/utils/secret.tool';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Page,
      Component,
      ComponentData,
      PageCollaborator,
      OperationLog,
      PageVersion,
      User,
    ]),
  ],
  controllers: [
    LegacyLowCodeController,
    PagesController,
    CollaborationController,
  ],
  providers: [
    SecretTool,
    PageReleaseService,
    PageAnalyticsService,
    CollaborationService,
    CollaborationGateway,
    OpenSumiConfigService,
    WorkspaceExplorerService,
    WorkspaceService,
    WorkspaceRuntimeService,
    WorkspaceSessionService,
  ],
})
export class FlowModule {}
