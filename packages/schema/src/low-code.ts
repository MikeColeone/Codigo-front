import type { TComponentTypes } from "./components";

// 页面表属性类型
export interface ILowCode {
  id: number;
  account_id: number;
  page_name: string;
  components: string[];
  tdk: string;
  desc: string;
  lockEditing?: boolean; // 编辑锁状态
}

// 组件表属性类型
export interface IComponent {
  id: number;
  account_id: number;
  page_id: number;
  type: TComponentTypes;
  options: Record<string, any>;
}

// 组件数据表属性类型
export interface IComponentData {
  id: number;
  user: string;
  page_id: number;
  props: Record<string, any>[];
}

// 页面版本表属性类型
export interface IPageVersion {
  id: string; // uuid
  page_id: number;
  account_id: number;
  version: number;
  desc: string;
  schema_data: Record<string, any>; // 快照数据
  created_at: Date;
}
