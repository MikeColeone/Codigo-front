import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type {
  PageWorkspaceExplorerResponse,
  PageWorkspaceFileResponse,
  PutPageWorkspaceFileResponse,
  WorkspaceExplorerNode,
} from '@codigo/schema';
import { existsSync } from 'node:fs';
import { readdir, readFile, stat, writeFile } from 'node:fs/promises';
import { extname, relative, resolve } from 'node:path';
import type { TCurrentUser } from 'src/shared/helpers/current-user.helper';
import { WorkspaceService } from 'src/modules/flow/service/workspace.service';

const EXPLORER_IGNORES = new Set([
  'node_modules',
  '.git',
  'dist',
  '.turbo',
  '.next',
]);

@Injectable()
export class WorkspaceExplorerService {
  constructor(private readonly workspaceService: WorkspaceService) {}

  async getPageWorkspaceExplorer(
    pageId: number,
    user: TCurrentUser,
  ): Promise<PageWorkspaceExplorerResponse> {
    const workspace = await this.workspaceService.getPageWorkspace(
      pageId,
      user,
    );
    if (!workspace.exists) {
      return {
        pageId,
        workspaceId: workspace.workspaceId,
        rootPath: '',
        tree: [],
      };
    }

    return {
      pageId,
      workspaceId: workspace.workspaceId,
      rootPath: workspace.workspaceRelativePath,
      tree: await this.readDirectoryTree(
        workspace.workspaceRoot,
        workspace.workspaceRoot,
      ),
    };
  }

  async getPageWorkspaceFile(
    pageId: number,
    user: TCurrentUser,
    filePath: string,
  ): Promise<PageWorkspaceFileResponse> {
    const workspace = await this.workspaceService.getPageWorkspace(
      pageId,
      user,
    );
    if (!workspace.exists) {
      throw new NotFoundException('工作区尚未生成');
    }

    const absolutePath = this.resolveWorkspacePath(
      workspace.workspaceRoot,
      filePath,
    );
    if (!existsSync(absolutePath)) {
      throw new NotFoundException('文件不存在');
    }

    const fileStat = await stat(absolutePath);
    if (!fileStat.isFile()) {
      throw new BadRequestException('目标路径不是文件');
    }

    return this.buildWorkspaceFileResponse(
      pageId,
      workspace.workspaceId,
      workspace.workspaceRoot,
      absolutePath,
    );
  }

  async savePageWorkspaceFile(
    pageId: number,
    user: TCurrentUser,
    filePath: string,
    content: string,
  ): Promise<PutPageWorkspaceFileResponse> {
    const workspace = await this.workspaceService.getPageWorkspace(
      pageId,
      user,
    );
    if (!workspace.exists) {
      throw new NotFoundException('工作区尚未生成');
    }

    const absolutePath = this.resolveWorkspacePath(
      workspace.workspaceRoot,
      filePath,
    );
    if (!existsSync(absolutePath)) {
      throw new NotFoundException('文件不存在');
    }

    const fileStat = await stat(absolutePath);
    if (!fileStat.isFile()) {
      throw new BadRequestException('目标路径不是文件');
    }

    await writeFile(absolutePath, content, 'utf8');

    return this.buildWorkspaceFileResponse(
      pageId,
      workspace.workspaceId,
      workspace.workspaceRoot,
      absolutePath,
    );
  }

  private async readDirectoryTree(
    directoryPath: string,
    workspaceRoot: string,
  ): Promise<WorkspaceExplorerNode[]> {
    const entries = await readdir(directoryPath, { withFileTypes: true });

    const visibleEntries = entries
      .filter((entry) => !EXPLORER_IGNORES.has(entry.name))
      .sort((left, right) => {
        if (left.isDirectory() && !right.isDirectory()) return -1;
        if (!left.isDirectory() && right.isDirectory()) return 1;
        return left.name.localeCompare(right.name);
      });

    return Promise.all(
      visibleEntries.map(async (entry) => {
        const absolutePath = resolve(directoryPath, entry.name);
        const relativePath = this.toPosixPath(
          relative(workspaceRoot, absolutePath),
        );

        if (entry.isDirectory()) {
          return {
            name: entry.name,
            path: relativePath,
            type: 'directory',
            children: await this.readDirectoryTree(absolutePath, workspaceRoot),
          } satisfies WorkspaceExplorerNode;
        }

        return {
          name: entry.name,
          path: relativePath,
          type: 'file',
        } satisfies WorkspaceExplorerNode;
      }),
    );
  }

  private resolveWorkspacePath(workspaceRoot: string, targetPath: string) {
    const normalizedTarget = targetPath
      .replaceAll('\\', '/')
      .replace(/^\/+/, '');
    const absolutePath = resolve(workspaceRoot, normalizedTarget);
    const relativePath = relative(workspaceRoot, absolutePath);

    if (
      relativePath.startsWith('..') ||
      relativePath.includes('..\\') ||
      relativePath.includes('../')
    ) {
      throw new BadRequestException('非法的工作区路径');
    }

    return absolutePath;
  }

  private async buildWorkspaceFileResponse(
    pageId: number,
    workspaceId: string,
    workspaceRoot: string,
    absolutePath: string,
  ) {
    const fileStat = await stat(absolutePath);

    return {
      pageId,
      workspaceId,
      path: this.toPosixPath(relative(workspaceRoot, absolutePath)),
      absolutePath,
      language: this.detectLanguage(absolutePath),
      content: await readFile(absolutePath, 'utf8'),
      updatedAt: fileStat.mtime.toISOString(),
    };
  }

  private detectLanguage(filePath: string) {
    const extension = extname(filePath).toLowerCase();
    const languageMap: Record<string, string> = {
      '.ts': 'typescript',
      '.tsx': 'typescript',
      '.js': 'javascript',
      '.jsx': 'javascript',
      '.json': 'json',
      '.css': 'css',
      '.html': 'html',
      '.md': 'markdown',
      '.yaml': 'yaml',
      '.yml': 'yaml',
    };

    return languageMap[extension] ?? 'plaintext';
  }

  private toPosixPath(pathValue: string) {
    return pathValue.replaceAll('\\', '/');
  }
}
