import type { GraphLayout, NodePosition, PowerNode } from "../model/types";

export function findRootIds(nodes: PowerNode[], rootId?: string): string[] {
  if (rootId) return [rootId];

  const ids = new Set(nodes.map((node) => node.id));
  return nodes.filter((node) => !node.parent || !ids.has(node.parent)).map((node) => node.id);
}

export function buildChildrenMap(nodes: PowerNode[]): Map<string, string[]> {
  const children = new Map<string, string[]>();

  for (const node of nodes) {
    children.set(node.id, []);
  }

  for (const node of nodes) {
    if (node.parent && children.has(node.parent)) {
      children.get(node.parent)?.push(node.id);
    }
  }

  return children;
}

export function layoutTree(nodes: PowerNode[], rootIds: string[], childrenMap: Map<string, string[]>): GraphLayout {
  const levels: string[][] = [];
  const visited = new Set<string>();
  const queue: Array<{ id: string; level: number }> = rootIds.map((id) => ({ id, level: 0 }));

  while (queue.length > 0) {
    const current = queue.shift();
    if (!current || visited.has(current.id)) continue;

    visited.add(current.id);
    levels[current.level] ??= [];
    levels[current.level].push(current.id);

    for (const childId of childrenMap.get(current.id) ?? []) {
      queue.push({ id: childId, level: current.level + 1 });
    }
  }

  for (const node of nodes) {
    if (!visited.has(node.id)) {
      levels[levels.length] = [node.id];
    }
  }

  const width = 1000;
  const height = Math.max(360, levels.reduce((max, level) => Math.max(max, level.length * 120), 0) + 80);
  const positions = new Map<string, NodePosition>();

  for (let levelIndex = 0; levelIndex < levels.length; levelIndex += 1) {
    const nodeIds = levels[levelIndex] ?? [];
    const x = levels.length === 1 ? width / 2 : 120 + (levelIndex * (width - 240)) / (levels.length - 1);

    for (let rowIndex = 0; rowIndex < nodeIds.length; rowIndex += 1) {
      const id = nodeIds[rowIndex];
      if (!id) continue;

      const y = nodeIds.length === 1 ? height / 2 : 60 + (rowIndex * (height - 120)) / (nodeIds.length - 1);
      positions.set(id, { x, y });
    }
  }

  return { width, height, positions };
}
