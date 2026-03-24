import type {
  ILowCode,
  IComponent,
  IComponentData,
  IPageVersion,
  SyncSchemaItem,
} from "..";

export type PostReleaseRequest = Omit<
  ILowCode,
  "id" | "account_id" | "components"
> & { components: Omit<IComponent, "account_id" | "page_id">[] };

export type PostQuestionDataRequest = Pick<IComponentData, "page_id" | "props">;

export type GetReleaseDataResponse = Omit<ILowCode, "components"> & {
  componentIds: string[];
  components: IComponent[];
};

export type getQuestionDataByIdRequest = Pick<IComponent, "id">;

export type GetPageVersionsResponse = Omit<IPageVersion, "schema_data">[];

export type GetPageVersionDetailResponse = IPageVersion;

export interface PageWorkspaceResponse {
  pageId: number;
  pageName: string;
  workspaceId: string;
  workspaceName: string;
  workspaceRoot: string;
  workspaceRelativePath: string;
  templateRoot: string;
  packageJsonPath: string;
  schemaFilePath: string;
  entryFilePath: string;
  packageManager: "pnpm";
  installCommand: string;
  devCommand: string;
  exists: boolean;
  componentCount: number;
  lastSyncedAt?: string;
  schema?: SyncSchemaItem[];
}
