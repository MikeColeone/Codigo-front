import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { PostReleaseRequest } from '@codigo/schema';
import type { TCurrentUser } from 'src/shared/helpers/current-user.helper';
import {
  Component,
  ComponentData,
  Page,
} from 'src/modules/flow/entity/low-code.entity';
import { PageVersion } from 'src/modules/flow/entity/page-version.entity';
import { DataSource, Repository } from 'typeorm';

function objectOmit<T extends Record<string, any>, K extends keyof T>(
  obj: T,
  keys: K[],
): Omit<T, K> {
  const result = { ...obj };
  for (const key of keys) {
    delete result[key];
  }
  return result;
}

@Injectable()
export class PageReleaseService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(Page)
    private readonly pageRepository: Repository<Page>,
    @InjectRepository(Component)
    private readonly componentRepository: Repository<Component>,
    @InjectRepository(ComponentData)
    private readonly componentDataRepository: Repository<ComponentData>,
    @InjectRepository(PageVersion)
    private readonly pageVersionRepository: Repository<PageVersion>,
  ) {}

  async release(body: PostReleaseRequest, user: TCurrentUser) {
    const { components, ...otherBody } = body;
    let id = 0;
    const queryRunner = this.dataSource.createQueryRunner();

    async function insertComponents(pageId: number) {
      const insertedComponentIds: string[] = [];
      for (const component of components) {
        const componentResult = await queryRunner.manager.insert(Component, {
          ...component,
          page_id: pageId,
          account_id: user.id,
        });
        insertedComponentIds.push(componentResult.identifiers[0].id);
      }

      await queryRunner.manager.update(Page, pageId, {
        components: insertedComponentIds,
      });
    }

    async function updatePage(existingPage: Page) {
      await queryRunner.manager.update(Page, existingPage.id, {
        ...otherBody,
        components: [],
      });

      for (const component of existingPage.components) {
        await queryRunner.manager.delete(Component, component);
      }

      const componentDatas = await queryRunner.manager.findBy(ComponentData, {
        page_id: existingPage.id,
      });
      for (const componentData of componentDatas) {
        await queryRunner.manager.delete(ComponentData, componentData.id);
      }

      await insertComponents(existingPage.id);
    }

    async function createPage() {
      const createdPage = await queryRunner.manager.insert(Page, {
        ...otherBody,
        account_id: user.id,
        components: [],
      });
      const pageId = createdPage.identifiers[0].id;
      id = pageId;
      await insertComponents(pageId);
    }

    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();
      const existingPages = await queryRunner.manager.findBy(Page, {
        account_id: user.id,
      });

      if (existingPages.length > 0) {
        id = existingPages[0].id;
        await updatePage(existingPages[0]);
      } else {
        await createPage();
      }

      const lastVersion = await queryRunner.manager.findOne(PageVersion, {
        where: { page_id: id },
        order: { version: 'DESC' },
      });
      const nextVersion = lastVersion ? lastVersion.version + 1 : 1;

      await queryRunner.manager.insert(PageVersion, {
        page_id: id,
        account_id: user.id,
        version: nextVersion,
        desc: `Version ${nextVersion}`,
        schema_data: body as any,
      });

      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException(`发布失败: ${String(err)}`);
    } finally {
      await queryRunner.release();
    }

    return {
      msg: '发布成功',
      data: id,
    };
  }

  async getPageVersions(pageId: number) {
    return await this.pageVersionRepository.find({
      where: { page_id: pageId },
      order: { created_at: 'DESC' },
      select: ['id', 'page_id', 'account_id', 'version', 'desc', 'created_at'],
    });
  }

  async getPageVersionDetail(pageId: number, versionId: string) {
    const version = await this.pageVersionRepository.findOne({
      where: { page_id: pageId, id: versionId },
    });
    if (!version) {
      throw new BadRequestException('版本不存在');
    }
    return version;
  }

  async getReleaseData(id: number | null, user?: TCurrentUser) {
    if (id == null) {
      return null;
    }

    const page = await this.pageRepository.findOneBy({
      id,
      account_id: user?.id,
    });
    if (!page) return;

    const components: (Component | null)[] = [];
    const componentIds = page.components;
    for (const componentId of componentIds) {
      const component = await this.componentRepository.findOneBy({
        id: Number(componentId),
      });
      components.push(component);
    }

    return {
      components,
      componentIds,
      ...objectOmit(page, ['components']),
    };
  }

  async getMyReleaseData(user: TCurrentUser) {
    const page = await this.pageRepository.findOneBy({
      account_id: user.id,
    });
    if (!page) return null;

    const components: (Component | null)[] = [];
    const componentIds = page.components;
    for (const componentId of componentIds) {
      const component = await this.componentRepository.findOneBy({
        id: Number(componentId),
      });
      components.push(component);
    }

    return {
      components,
      componentIds,
      ...objectOmit(page, ['components']),
    };
  }
}
