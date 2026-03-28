import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { PostQuestionDataRequest } from '@codigo/schema';
import type { TCurrentUser } from 'src/shared/helpers/current-user.helper';
import {
  Component,
  ComponentData,
  Page,
} from 'src/modules/flow/entity/low-code.entity';
import { In, Repository } from 'typeorm';

@Injectable()
export class PageAnalyticsService {
  constructor(
    @InjectRepository(Page)
    private readonly pageRepository: Repository<Page>,
    @InjectRepository(Component)
    private readonly componentRepository: Repository<Component>,
    @InjectRepository(ComponentData)
    private readonly componentDataRepository: Repository<ComponentData>,
  ) {}

  async isQuestionDataPosted(key: string, pageId: number) {
    const isExist = await this.componentDataRepository.findOneBy({
      user: key,
      page_id: pageId,
    });
    return !!isExist;
  }

  async postQuestionData(body: PostQuestionDataRequest, key: string) {
    const { page_id, props } = body;
    const isExist = await this.componentDataRepository.findOneBy({
      user: key,
      page_id,
    });

    if (!isExist) {
      await this.componentDataRepository.save({ user: key, page_id, props });
    }

    return { msg: '提交成功！感谢您的参与！' };
  }

  async getQuestionComponents(user: TCurrentUser) {
    return await this.componentRepository.findBy({
      account_id: user.id,
      type: In(['input', 'textArea', 'radio', 'checkbox']),
    });
  }

  async getQuestionData(userId: number) {
    const page = await this.pageRepository.findOneBy({
      account_id: userId,
    });
    if (!page) {
      throw new BadRequestException('未找到页面，请先发布页面信息');
    }

    const componentDatas = await this.componentDataRepository.findBy({
      page_id: page.id,
    });
    return await Promise.all(
      componentDatas.map(async (comp) => {
        return await Promise.all(
          comp.props.map(async (item) => {
            const componentResult = await this.componentRepository.findOneBy({
              id: item.id,
            });
            return {
              result: item,
              type: componentResult?.type,
              options: componentResult?.options?.options || {},
            };
          }),
        );
      }),
    );
  }

  async getQuestionDataByIdRequest({
    id,
    userId,
  }: {
    id: number;
    userId: number;
  }) {
    const page = await this.pageRepository.findOneBy({
      account_id: userId,
    });
    if (!page) {
      throw new BadRequestException('未找到页面，请先发布页面信息');
    }

    const componentDatas = await this.componentDataRepository.findBy({
      page_id: page.id,
    });
    return await Promise.all(
      componentDatas
        .map((comp) =>
          comp.props
            .filter((item) => item.id === id)
            .map(async (item) => {
              const componentResult = await this.componentRepository.findOneBy({
                id: item.id,
              });
              return {
                value: Array.isArray(item.value)
                  ? item.value
                  : item.value
                    ? [item.value]
                    : null,
                options: componentResult?.options?.options || null,
              };
            }),
        )
        .flat(),
    );
  }
}
