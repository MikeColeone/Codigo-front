import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type {
  InviteCollaboratorRequest,
  UpdateCollaboratorRoleRequest,
} from '@codigo/schema';
import { PageCollaborator } from 'src/modules/flow/entity/page-collaborator.entity';
import { OperationLog } from 'src/modules/flow/entity/operation-log.entity';
import { Page } from 'src/modules/flow/entity/low-code.entity';
import { User } from 'src/modules/user/entity/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CollaborationService {
  constructor(
    @InjectRepository(Page)
    private readonly pageRepository: Repository<Page>,
    @InjectRepository(PageCollaborator)
    private readonly pageCollaboratorRepository: Repository<PageCollaborator>,
    @InjectRepository(OperationLog)
    private readonly operationLogRepository: Repository<OperationLog>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async getCollaborators(pageId: number) {
    const collabs = await this.pageCollaboratorRepository.find({
      where: { page_id: pageId },
    });

    const page = await this.pageRepository.findOneBy({ id: pageId });
    if (!page) {
      throw new BadRequestException('页面不存在');
    }

    const ownerId = page.account_id;
    const result: any[] = [];

    const owner = await this.userRepository.findOneBy({ id: ownerId });
    if (owner) {
      result.push({
        id: `owner-${owner.id}`,
        user_id: owner.id,
        page_id: pageId,
        name: owner.username || 'Owner',
        role: 'owner',
      });
    }

    for (const collab of collabs) {
      const user = await this.userRepository.findOneBy({ id: collab.user_id });
      if (user) {
        result.push({
          id: collab.id,
          user_id: user.id,
          page_id: pageId,
          name: user.username || 'User',
          role: collab.role,
        });
      }
    }

    return {
      lockEditing: page.lockEditing,
      collaborators: result,
    };
  }

  async inviteCollaborator(
    pageId: number,
    body: InviteCollaboratorRequest,
    currentUserId: number,
  ) {
    const page = await this.pageRepository.findOneBy({ id: pageId });
    if (!page || page.account_id !== currentUserId) {
      throw new BadRequestException('只有所有者才能邀请成员');
    }

    const targetUser = await this.userRepository.findOneBy({
      username: body.userName,
    });
    if (!targetUser) {
      throw new BadRequestException('未找到该用户');
    }

    if (targetUser.id === currentUserId) {
      throw new BadRequestException('不能邀请自己');
    }

    const existingCollaborator =
      await this.pageCollaboratorRepository.findOneBy({
        page_id: pageId,
        user_id: targetUser.id,
      });
    if (existingCollaborator) {
      throw new BadRequestException('该用户已是协作者');
    }

    const newCollaborator = this.pageCollaboratorRepository.create({
      page_id: pageId,
      user_id: targetUser.id,
      role: body.role,
    });
    await this.pageCollaboratorRepository.save(newCollaborator);

    await this.logOperation(
      pageId,
      currentUserId,
      'invite_member',
      body.userName,
    );

    return { msg: '邀请成功' };
  }

  async updateCollaboratorRole(
    pageId: number,
    targetUserId: number,
    body: UpdateCollaboratorRoleRequest,
    currentUserId: number,
  ) {
    const page = await this.pageRepository.findOneBy({ id: pageId });
    if (!page || page.account_id !== currentUserId) {
      throw new BadRequestException('只有所有者才能修改角色');
    }

    const collaborator = await this.pageCollaboratorRepository.findOneBy({
      page_id: pageId,
      user_id: targetUserId,
    });
    if (!collaborator) {
      throw new BadRequestException('协作者不存在');
    }

    collaborator.role = body.role;
    await this.pageCollaboratorRepository.save(collaborator);

    const targetUser = await this.userRepository.findOneBy({
      id: targetUserId,
    });
    await this.logOperation(
      pageId,
      currentUserId,
      'update_role',
      `${targetUser?.username || 'User'} -> ${body.role}`,
    );

    return { msg: '修改成功' };
  }

  async removeCollaborator(
    pageId: number,
    targetUserId: number,
    currentUserId: number,
  ) {
    const page = await this.pageRepository.findOneBy({ id: pageId });
    if (!page || page.account_id !== currentUserId) {
      throw new BadRequestException('只有所有者才能移除成员');
    }

    const collaborator = await this.pageCollaboratorRepository.findOneBy({
      page_id: pageId,
      user_id: targetUserId,
    });
    if (!collaborator) {
      throw new BadRequestException('协作者不存在');
    }

    await this.pageCollaboratorRepository.remove(collaborator);

    const targetUser = await this.userRepository.findOneBy({
      id: targetUserId,
    });
    await this.logOperation(
      pageId,
      currentUserId,
      'remove_member',
      targetUser?.username || 'User',
    );

    return { msg: '移除成功' };
  }

  private async logOperation(
    pageId: number,
    actorId: number,
    event: string,
    target: string,
  ) {
    const log = this.operationLogRepository.create({
      page_id: pageId,
      actor_id: actorId,
      event,
      target,
    });
    await this.operationLogRepository.save(log);
  }
}
