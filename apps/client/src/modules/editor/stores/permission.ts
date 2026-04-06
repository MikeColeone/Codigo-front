import { makeAutoObservable } from "mobx";

export type PermissionRole = "owner" | "editor" | "commenter" | "viewer";
export type PermissionAction =
  | "view"
  | "comment"
  | "edit_content"
  | "edit_structure"
  | "manage_member"
  | "publish"
  | "save_draft";

export interface Collaborator {
  id: string;
  user_id: number;
  name: string;
  role: PermissionRole;
  color: string;
  isOnline: boolean;
  lastActiveAt: number;
}

export interface PermissionLog {
  id: string;
  actorId: string;
  event: string;
  target: string;
  createdAt: number;
}

interface IEditorPermissionStore {
  documentId: string;
  currentUserId: string;
  lockEditing: boolean;
  collaborators: Collaborator[];
  logs: PermissionLog[];
}

export const roleLabelMap: Record<PermissionRole, string> = {
  owner: "所有者",
  editor: "可编辑",
  commenter: "可评论",
  viewer: "只读",
};

export const roleColorMap: Record<PermissionRole, string> = {
  owner: "#f97316",
  editor: "#10b981",
  commenter: "#3b82f6",
  viewer: "#64748b",
};

/**
 * 创建编辑器协作权限状态仓库。
 */
export function createEditorPermissionStore() {
  return makeAutoObservable<IEditorPermissionStore>({
    documentId: "codigo-editor-doc",
    currentUserId: "",
    lockEditing: false,
    collaborators: [],
    logs: [],
  });
}

export type TEditorPermissionStore = ReturnType<
  typeof createEditorPermissionStore
>;
