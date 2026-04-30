import type { IEditorPageGroupSchema, IEditorPageSchema } from "@codigo/schema";

export type AdminShellPage = Pick<IEditorPageSchema, "id" | "name" | "path">;
export type AdminShellPageGroup = Pick<IEditorPageGroupSchema, "id" | "name" | "path">;

export type ShellTreeNode = {
  path: string;
  label: string;
  group?: AdminShellPageGroup;
  page?: AdminShellPage;
  children: ShellTreeNode[];
  order: number;
};

export function buildShellTree(
  pages: AdminShellPage[],
  pageGroups: AdminShellPageGroup[] = [],
) {
  const roots = new Map<string, ShellTreeNode>();
  const childrenMap = new Map<string, Map<string, ShellTreeNode>>();

  // Initialize childrenMap for each group
  pageGroups.forEach((group) => {
    childrenMap.set(group.id, new Map<string, ShellTreeNode>());
  });

  // First pass: create all nodes and categorize them
  pages.forEach((page) => {
    const node: ShellTreeNode = {
      path: page.path,
      label: page.name,
      page,
      children: [],
      order: 0,
    };

    // Check if page belongs to a group
    const group = pageGroups.find((g) => g.path && page.path.startsWith(g.path + "/"));
    if (group && childrenMap.has(group.id)) {
      node.group = group;
      childrenMap.get(group.id)!.set(page.path, node);
    } else {
      roots.set(page.path, node);
    }
  });

  // Second pass: build tree structure
  childrenMap.forEach((groupChildren, groupId) => {
    const group = pageGroups.find((g) => g.id === groupId);
    if (!group) return;

    const groupNode: ShellTreeNode = {
      path: group.path,
      label: group.name,
      group,
      children: [],
      order: 0,
    };

    // Add children to group
    groupChildren.forEach((child) => {
      groupNode.children.push(child);
    });

    // Sort children by path
    groupNode.children.sort((a, b) => a.path.localeCompare(b.path));

    roots.set(group.path, groupNode);
  });

  // Convert to array and sort
  const result: ShellTreeNode[] = [];
  roots.forEach((node) => {
    result.push(node);
  });

  // Sort by order (if specified) or path
  result.sort((a, b) => {
    if (a.order !== b.order) return a.order - b.order;
    return a.path.localeCompare(b.path);
  });

  return result;
}

export function findActiveNode(
  tree: ShellTreeNode[],
  activePath: string | null,
): ShellTreeNode | null {
  if (!activePath) return null;

  for (const node of tree) {
    if (node.path === activePath) return node;
    if (node.children.length > 0) {
      const found = findActiveNode(node.children, activePath);
      if (found) return found;
    }
  }

  return null;
}

export function deriveOpenPaths(activePagePath: string | null): Set<string> {
  if (!activePagePath) return new Set();
  const paths = activePagePath.split("/");
  const openPaths = new Set<string>();
  let currentPath = "";
  for (const segment of paths) {
    currentPath = currentPath ? `${currentPath}/${segment}` : segment;
    openPaths.add(currentPath);
  }
  return openPaths;
}

export function resolveActiveTopNode(
  tree: ShellTreeNode[],
  activePagePath: string | null,
): ShellTreeNode | null {
  if (!activePagePath) return null;
  const topPath = activePagePath.split("/")[0];
  return tree.find((node) => node.path === topPath) ?? null;
}
