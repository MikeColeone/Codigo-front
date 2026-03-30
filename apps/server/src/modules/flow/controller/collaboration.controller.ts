import {
  Controller,
  Post,
  Put,
  Delete,
  Get,
  Body,
  Param,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CollaborationService } from 'src/modules/flow/service/collaboration.service';
import type { TCurrentUser } from 'src/shared/helpers/current-user.helper';
import { getUserMess } from 'src/shared/helpers/current-user.helper';
import type {
  InviteCollaboratorRequest,
  UpdateCollaboratorRoleRequest,
} from '@codigo/schema';

@Controller('pages/:pageId/collaborators')
@UseGuards(AuthGuard('jwt'))
export class CollaborationController {
  constructor(private readonly collaborationService: CollaborationService) {}

  @Get()
  async getCollaborators(@Param('pageId', ParseIntPipe) pageId: number) {
    return this.collaborationService.getCollaborators(pageId);
  }

  @Post()
  async inviteCollaborator(
    @Param('pageId', ParseIntPipe) pageId: number,
    @Body() body: InviteCollaboratorRequest,
    @getUserMess() user: TCurrentUser,
  ) {
    return this.collaborationService.inviteCollaborator(pageId, body, user.id);
  }

  @Put(':userId')
  async updateCollaboratorRole(
    @Param('pageId', ParseIntPipe) pageId: number,
    @Param('userId', ParseIntPipe) targetUserId: number,
    @Body() body: UpdateCollaboratorRoleRequest,
    @getUserMess() user: TCurrentUser,
  ) {
    return this.collaborationService.updateCollaboratorRole(
      pageId,
      targetUserId,
      body,
      user.id,
    );
  }

  @Delete(':userId')
  async removeCollaborator(
    @Param('pageId', ParseIntPipe) pageId: number,
    @Param('userId', ParseIntPipe) targetUserId: number,
    @getUserMess() user: TCurrentUser,
  ) {
    return this.collaborationService.removeCollaborator(
      pageId,
      targetUserId,
      user.id,
    );
  }
}
