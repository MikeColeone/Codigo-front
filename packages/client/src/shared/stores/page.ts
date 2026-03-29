import { makeAutoObservable } from "mobx";
import type {
  PageWorkspaceExplorerResponse,
  PageWorkspaceFileResponse,
  PageWorkspaceIDEConfigResponse,
  PageWorkspaceResponse,
  PageWorkspaceRuntimeResponse,
  PageWorkspaceSessionResponse,
} from "@codigo/schema";

export type DeviceType = "mobile" | "pc";
export type CodeFramework = "react" | "vue";
export type EditorMode = "visual" | "code" | "webide";

export type EChartsThemeSetting = "codigoTheme" | "";

export interface WorkspaceFileState {
  file: PageWorkspaceFileResponse;
  isDirty: boolean;
  isSaving: boolean;
}

interface IStorePage {
  title: string;
  description: string;
  tdk: string;
  deviceType: DeviceType;
  canvasWidth: number;
  canvasHeight: number;
  codeFramework: CodeFramework;
  editorMode: EditorMode;
  chartTheme: EChartsThemeSetting;
  workspace: PageWorkspaceResponse | null;
  workspaceExplorer: PageWorkspaceExplorerResponse | null;
  workspaceSession: PageWorkspaceSessionResponse | null;
  workspaceRuntime: PageWorkspaceRuntimeResponse | null;
  workspaceIDEConfig: PageWorkspaceIDEConfigResponse | null;
  activeWorkspaceFilePath: string | null;
  workspaceOpenFilePaths: string[];
  workspaceFiles: Record<string, WorkspaceFileState>;
}

export function createStorePage() {
  return makeAutoObservable<IStorePage>({
    title: "Codigo低代码平台",
    description: "Codigo低代码开发页面详情",
    tdk: "lowcode platform, lowcode development, lowcode page details",
    deviceType: "mobile",
    canvasWidth: 380,
    canvasHeight: 700,
    codeFramework: "react",
    editorMode: "visual",
    chartTheme: "codigoTheme",
    workspace: null,
    workspaceExplorer: null,
    workspaceSession: null,
    workspaceRuntime: null,
    workspaceIDEConfig: null,
    activeWorkspaceFilePath: null,
    workspaceOpenFilePaths: [],
    workspaceFiles: {},
  });
}

export type TStorePage = ReturnType<typeof createStorePage>;
