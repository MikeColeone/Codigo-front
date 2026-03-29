import { readDir, readFile, writeFile } from '@codigo/file-service';
import { Autowired, Injectable } from '@opensumi/di';
import { URI, Uri, AppConfig, Deferred } from '@opensumi/ide-core-browser';

import { AbstractHttpFileService } from './browser-fs-provider';

export type HttpTreeNode = {
  path: string;
  content?: string;
  type: 'file' | 'directory';
  children: HttpTreeList;
};

export type HttpTreeList = HttpTreeNode[];

@Injectable()
export class HttpFileService extends AbstractHttpFileService {
  @Autowired(AppConfig)
  private appConfig: AppConfig;

  private _whenReady: Deferred<void> = new Deferred();

  get whenReady() {
    return this._whenReady.promise;
  }

  async initWorkspace(uri: Uri): Promise<Record<string, never>> {
    this._whenReady.resolve();
    return {};
  }

  async readFile(uri: Uri, encoding?: string): Promise<string> {
    const _uri = new URI(uri);
    const relativePath = URI.file(this.appConfig.workspaceDir).relative(_uri)!.toString();
    return readFile(relativePath);
  }

  async readDir(uri: Uri) {
    const _uri = new URI(uri);
    const relativePath = this.getRelativePath(_uri);
    const children = await readDir(relativePath);
    return children.map((item) => ({
      path: item.path,
      type: item.type,
      children: [],
    }));
  }

  async updateFile(uri: Uri, content: string, options: { encoding?: string; newUri?: Uri }): Promise<void> {
    if (options.newUri) {
      return;
    }
    const _uri = new URI(uri);
    const relativePath = this.getRelativePath(_uri);
    await writeFile(relativePath, content);
  }

  async createFile(uri: Uri, content: string, options: { encoding?: string }) {
    return;
  }

  async deleteFile(uri: Uri, options: { recursive: boolean; moveToTrash?: boolean }) {
    return;
  }

  protected getRelativePath(uri: URI) {
    const path = URI.file(this.appConfig.workspaceDir).relative(uri)!.toString();
    return path;
  }
}
