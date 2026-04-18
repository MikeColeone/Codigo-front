import { observer } from "mobx-react-lite";
import { Button, Input } from "antd";
import {
  FileTextOutlined,
  FolderOpenOutlined,
  FolderOutlined,
  PlusOutlined,
  RightOutlined,
} from "@ant-design/icons";
import { useEditorComponents } from "@/modules/editor/hooks";
import { useEffect, useMemo, useState } from "react";
import type { IEditorPageSchema } from "@codigo/schema";

interface EditorPageManagerProps {
  embedded?: boolean;
  variant?: "sidebar" | "dropdown";
}

const EditorPageManager =  observer(function ({
  embedded = false,
  variant = "sidebar",
}: EditorPageManagerProps) {
  const {
    getPages,
    getActivePage,
    createEditorPage,
    switchEditorPage,
    updateEditorPageMeta,
  } = useEditorComponents();
  const pages = getPages.get();
  const activePage = getActivePage.get();
  const [keyword, setKeyword] = useState("");
  const [selectedTarget, setSelectedTarget] = useState<
    | { type: "page"; id: string }
    | { type: "folder"; path: string }
    | null
  >(null);
  const [openPaths, setOpenPaths] = useState<Set<string>>(() => new Set());

  useEffect(() => {
    if (!activePage) {
      return;
    }
    setSelectedTarget({ type: "page", id: activePage.id });
    const segments = activePage.path.split("/").filter(Boolean);
    if (segments.length <= 1) {
      return;
    }
    setOpenPaths((prev) => {
      const next = new Set(prev);
      let current = "";
      for (let i = 0; i < segments.length - 1; i += 1) {
        current = current ? `${current}/${segments[i]}` : segments[i];
        next.add(current);
      }
      return next;
    });
  }, [activePage?.id, activePage?.path]);

  const filteredPages = useMemo(() => {
    const nextKeyword = keyword.trim().toLowerCase();
    if (!nextKeyword) {
      return pages;
    }
    return pages.filter((page) => {
      const name = page.name?.toLowerCase() ?? "";
      const path = page.path?.toLowerCase() ?? "";
      return name.includes(nextKeyword) || path.includes(nextKeyword);
    });
  }, [keyword, pages]);

  type PageTreeNode = {
    path: string;
    label: string;
    page?: IEditorPageSchema;
    children: PageTreeNode[];
    order: number;
  };

  const treeRoots = useMemo<PageTreeNode[]>(() => {
    const roots = new Map<string, PageTreeNode>();
    const childrenMap = new Map<string, Map<string, PageTreeNode>>();

    const getChildren = (path: string) => {
      const existing = childrenMap.get(path);
      if (existing) return existing;
      const created = new Map<string, PageTreeNode>();
      childrenMap.set(path, created);
      return created;
    };

    const ensureNode = (
      parent: string,
      segment: string,
      fullPath: string,
      order: number,
    ) => {
      const map = parent ? getChildren(parent) : roots;
      const existing = map.get(segment);
      if (existing) {
        existing.order = Math.min(existing.order, order);
        return existing;
      }
      const created: PageTreeNode = {
        path: fullPath,
        label: segment,
        children: [],
        order,
      };
      map.set(segment, created);
      return created;
    };

    filteredPages.forEach((page, index) => {
      const segments = page.path.split("/").filter(Boolean);
      if (!segments.length) {
        return;
      }
      let parent = "";
      let currentNode: PageTreeNode | null = null;
      for (let i = 0; i < segments.length; i += 1) {
        const segment = segments[i];
        const fullPath = parent ? `${parent}/${segment}` : segment;
        currentNode = ensureNode(parent, segment, fullPath, index);
        parent = fullPath;
      }
      if (currentNode) {
        currentNode.page = page;
      }
    });

    const materialize = (map: Map<string, PageTreeNode>) => {
      const nodes = Array.from(map.values());
      nodes.forEach((node) => {
        const childMap = childrenMap.get(node.path);
        if (childMap) {
          node.children = materialize(childMap);
          if (node.children.length) {
            node.order = Math.min(node.order, node.children[0]?.order ?? node.order);
          }
        }
      });
      return nodes.sort((a, b) => (a.order !== b.order ? a.order - b.order : a.path.localeCompare(b.path)));
    };

    return materialize(roots);
  }, [filteredPages]);

  const selectedParentPath = useMemo(() => {
    if (selectedTarget?.type === "folder") {
      return selectedTarget.path;
    }
    if (selectedTarget?.type === "page") {
      return pages.find((page) => page.id === selectedTarget.id)?.path ?? null;
    }
    return activePage?.path ?? null;
  }, [activePage?.path, pages, selectedTarget]);

  const toggleOpen = (path: string) => {
    setOpenPaths((prev) => {
      const next = new Set(prev);
      if (next.has(path)) {
        next.delete(path);
      } else {
        next.add(path);
      }
      return next;
    });
  };

  const renderTreeNode = (node: PageTreeNode, depth: number) => {
    const isOpen = openPaths.has(node.path);
    const hasChildren = node.children.length > 0;
    const isActive = Boolean(activePage && node.page?.id === activePage.id);
    const isSelected =
      (selectedTarget?.type === "folder" && selectedTarget.path === node.path) ||
      (selectedTarget?.type === "page" && node.page?.id === selectedTarget.id);

    const rowClassName = `w-full border-0 px-2 py-1.5 text-left transition-colors ${
      isActive
        ? "bg-[var(--ide-active)] text-[var(--ide-text)]"
        : "text-[var(--ide-text)] hover:bg-[var(--ide-hover)]"
    }`;

    return (
      <div key={node.path}>
        <div
          className={`flex items-center gap-1 ${isSelected ? "outline outline-1 outline-[var(--ide-accent)]/35 outline-offset-[-1px]" : ""}`}
          style={{ paddingLeft: depth * 10 }}
        >
          {hasChildren ? (
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                toggleOpen(node.path);
                setSelectedTarget({ type: "folder", path: node.path });
              }}
              className="flex h-6 w-6 items-center justify-center rounded-sm text-[var(--ide-text-muted)] hover:bg-[var(--ide-hover)] hover:text-[var(--ide-text)]"
              aria-label={isOpen ? "收起" : "展开"}
            >
              <RightOutlined className={isOpen ? "rotate-90 text-[11px]" : "text-[11px]"} />
            </button>
          ) : (
            <div className="h-6 w-6" />
          )}
          <button
            type="button"
            onClick={() => {
              if (node.page) {
                setSelectedTarget({ type: "page", id: node.page.id });
                switchEditorPage(node.page.id);
                return;
              }
              setSelectedTarget({ type: "folder", path: node.path });
              if (hasChildren) {
                toggleOpen(node.path);
              }
            }}
            className={rowClassName}
          >
            <div className="flex items-center gap-2">
              {hasChildren ? (
                isOpen ? (
                  <FolderOpenOutlined className={isActive ? "text-[var(--ide-accent)]" : "text-[var(--ide-text-muted)]"} />
                ) : (
                  <FolderOutlined className={isActive ? "text-[var(--ide-accent)]" : "text-[var(--ide-text-muted)]"} />
                )
              ) : (
                <FileTextOutlined className={isActive ? "text-[var(--ide-accent)]" : "text-[var(--ide-text-muted)]"} />
              )}
              <div className="min-w-0 flex-1">
                <div className="truncate text-[12px] font-medium">
                  {node.page?.name ?? node.label}
                </div>
                <div className="truncate text-[10px] opacity-60 font-mono">
                  {node.page?.path ?? node.path}
                </div>
              </div>
            </div>
          </button>
        </div>
        {hasChildren && isOpen ? (
          <div className="space-y-1">
            {node.children.map((child) => renderTreeNode(child, depth + 1))}
          </div>
        ) : null}
      </div>
    );
  };

  if (embedded) {
    const containerClassName =
      variant === "dropdown"
        ? "flex w-[340px] max-h-[560px] min-h-0 flex-col overflow-hidden rounded-md border border-[var(--ide-border)] bg-[var(--ide-sidebar-bg)] shadow-[0_14px_40px_-28px_rgba(0,0,0,0.55)]"
        : "flex h-full min-h-0 flex-col overflow-hidden bg-[var(--ide-sidebar-bg)]";

    return (
      <div className={containerClassName}>
        <div className="flex items-center justify-between border-b border-[var(--ide-border)] px-4 py-2">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-[var(--ide-text-muted)]">页面管理</div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              type="primary"
              size="small"
              icon={<PlusOutlined />}
              onClick={() => createEditorPage()}
              className="!rounded-sm"
            >
              新建
            </Button>
            <Button
              size="small"
              icon={<PlusOutlined />}
              disabled={!selectedParentPath}
              onClick={() => {
                if (!selectedParentPath) {
                  return;
                }
                createEditorPage({ parentPath: selectedParentPath });
                setOpenPaths((prev) => {
                  const next = new Set(prev);
                  next.add(selectedParentPath);
                  return next;
                });
              }}
              className="!rounded-sm !border-[var(--ide-control-border)] !bg-[var(--ide-control-bg)] !text-[var(--ide-text)] hover:!bg-[var(--ide-hover)]"
            >
              子页
            </Button>
          </div>
        </div>

        <div className="border-b border-[var(--ide-border)] px-3 py-2">
          <Input
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
            allowClear
            size="small"
            placeholder="搜索页面（名称 / 路径）"
            className="!bg-[var(--ide-control-bg)] !border-[var(--ide-control-border)] !text-[var(--ide-text)]"
          />
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-2 py-2 scrollbar-thin scrollbar-thumb-[var(--ide-border)] hover:scrollbar-thumb-[var(--ide-text-muted)] scrollbar-track-transparent">
          <div className="space-y-1">
            {treeRoots.map((node) => renderTreeNode(node, 0))}
          </div>
        </div>

        {activePage ? (
          <div className="border-t border-[var(--ide-border)] p-3">
            <div className="space-y-2">
              <div className="text-[10px] font-bold uppercase tracking-wider text-[var(--ide-text-muted)]">
                当前页面配置
              </div>
              <Input
                key={`${activePage.id}-${activePage.name}-embedded-name`}
                defaultValue={activePage.name}
                size="small"
                onBlur={(event) =>
                  updateEditorPageMeta(activePage.id, {
                    name: event.target.value,
                  })
                }
                className="!bg-[var(--ide-control-bg)] !border-[var(--ide-control-border)] !text-[var(--ide-text)]"
              />
              <Input
                key={`${activePage.id}-${activePage.path}-embedded-path`}
                defaultValue={activePage.path}
                size="small"
                onBlur={(event) =>
                  updateEditorPageMeta(activePage.id, {
                    path: event.target.value,
                  })
                }
                className="!bg-[var(--ide-control-bg)] !border-[var(--ide-control-border)] !text-[var(--ide-text)]"
              />
            </div>
          </div>
        ) : null}
      </div>
    );
  }

  const content = (
    <>
      <div className="rounded-[22px] border border-slate-200/80 bg-[linear-gradient(135deg,rgba(59,130,246,0.12),rgba(255,255,255,0.98))] p-3.5 shadow-[0_20px_40px_-32px_rgba(59,130,246,0.75)]">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <div className="rounded-full bg-white/85 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-sky-700">
              Pages
            </div>
            <div className="mt-2 text-sm font-semibold text-slate-900">
              页面管理
            </div>
          </div>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => createEditorPage()}
            className="!rounded-xl"
          >
            新建
          </Button>
        </div>
        <div className="text-[12px] leading-5 text-slate-500">
          适合拆分真正独立的页面，再通过页面跳转动作串联，不必把多页逻辑都塞进同一块内容切换里。
        </div>
      </div>

      <div className="mt-3 min-h-0 flex-1 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-200/60 hover:scrollbar-thumb-slate-300 scrollbar-track-transparent">
        <div className="space-y-2">
          {pages.map((page, index) => {
            const isActive = page.id === activePage?.id;

            return (
              <button
                key={page.id}
                type="button"
                onClick={() => switchEditorPage(page.id)}
                className={`w-full rounded-[20px] border px-3.5 py-3 text-left transition ${
                  isActive
                    ? "border-sky-300 bg-sky-50 shadow-[0_18px_36px_-30px_rgba(59,130,246,0.65)]"
                    : "border-slate-200/80 bg-white hover:border-slate-300 hover:bg-slate-50"
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span
                        className={`flex h-8 w-8 items-center justify-center rounded-2xl text-sm ${
                          isActive
                            ? "bg-sky-500/12 text-sky-600"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        <FileTextOutlined />
                      </span>
                      <div className="min-w-0">
                        <div className="truncate text-sm font-semibold text-slate-900">
                          {page.name}
                        </div>
                        <div className="truncate text-[12px] text-slate-500">
                          page:{page.path}
                        </div>
                      </div>
                    </div>
                  </div>
                  <RightOutlined
                    className={isActive ? "text-sky-500" : "text-slate-300"}
                  />
                </div>
                <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400">
                  <span>#{index + 1}</span>
                  <span>{page.components.length} 个根节点</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {activePage ? (
        <div className="mt-3 rounded-[22px] border border-slate-200/80 bg-white p-3.5 shadow-[0_18px_36px_-34px_rgba(15,23,42,0.5)]">
          <div className="mb-3 text-sm font-semibold text-slate-900">
            当前页面
          </div>
          <div className="space-y-2.5">
            <Input
              key={`${activePage.id}-${activePage.name}-name`}
              defaultValue={activePage.name}
              onBlur={(event) =>
                updateEditorPageMeta(activePage.id, {
                  name: event.target.value,
                })
              }
              onPressEnter={(event) => {
                updateEditorPageMeta(activePage.id, {
                  name: event.currentTarget.value,
                });
                event.currentTarget.blur();
              }}
              placeholder="页面名称"
            />
            <Input
              key={`${activePage.id}-${activePage.path}-path`}
              defaultValue={activePage.path}
              onBlur={(event) =>
                updateEditorPageMeta(activePage.id, {
                  path: event.target.value,
                })
              }
              onPressEnter={(event) => {
                updateEditorPageMeta(activePage.id, {
                  path: event.currentTarget.value,
                });
                event.currentTarget.blur();
              }}
              placeholder="跳转路径标识"
            />
          </div>
          <div className="mt-3 rounded-2xl bg-slate-50 px-3 py-2.5 text-[12px] leading-5 text-slate-500">
            页面跳转动作里填写
            <span className="mx-1 rounded-md bg-white px-1.5 py-0.5 font-medium text-sky-600">
              {`page:${activePage.path}`}
            </span>
            即可切到当前页。
          </div>
        </div>
      ) : null}
    </>
  );

  return (
    <div className="flex h-full w-[272px] shrink-0 flex-col border-r border-slate-200/80 bg-white/88 px-3 py-3 shadow-[10px_0_40px_-34px_rgba(15,23,42,0.45)] backdrop-blur-xl">
      {content}
    </div>
  );
});


export default EditorPageManager;
