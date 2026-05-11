import type { PowerNode } from "../model/types";

function sumOrNull(values: Array<number | null>): number | null {
  const numeric = values.filter((value): value is number => value !== null);
  if (!numeric.length) return null;
  return numeric.reduce((acc, value) => acc + value, 0);
}

function sumPositive(values: Array<number | null>): number | null {
  const positive = values.filter((value): value is number => value !== null && value > 0);
  if (!positive.length) return null;
  return positive.reduce((acc, value) => acc + value, 0);
}

export function computeTopologyMetrics(nodes: PowerNode[], childrenMap: Map<string, string[]>): PowerNode[] {
  const nodeMap = new Map(nodes.map((node) => [node.id, node]));
  const computedCache = new Map<string, { power: number | null; current: number | null }>();

  const dfs = (nodeId: string, stack: Set<string>): { power: number | null; current: number | null } => {
    if (computedCache.has(nodeId)) return computedCache.get(nodeId)!;

    if (stack.has(nodeId)) {
      const node = nodeMap.get(nodeId);
      return {
        power: node?.live.power ?? null,
        current: node?.live.current ?? null,
      };
    }

    stack.add(nodeId);

    const node = nodeMap.get(nodeId);
    if (!node) {
      stack.delete(nodeId);
      return { power: null, current: null };
    }

    const childIds = childrenMap.get(nodeId) ?? [];
    const childComputed = childIds.map((id) => dfs(id, stack));

    const childPowerSum = sumOrNull(childComputed.map((m) => m.power));
    const childCurrentSum = sumOrNull(childComputed.map((m) => m.current));

    const result =
      node.type === "grid"
        ? {
            power: sumPositive(childComputed.map((m) => m.power)) ?? 0,
            current: sumPositive(childComputed.map((m) => m.current)) ?? 0,
          }
        : {
            power: node.live.power ?? childPowerSum,
            current: node.live.current ?? childCurrentSum,
          };

    computedCache.set(nodeId, result);
    stack.delete(nodeId);

    return result;
  };

  for (const node of nodes) {
    dfs(node.id, new Set());
  }

  return nodes.map((node) => {
    const computed = computedCache.get(node.id) ?? { power: node.live.power, current: node.live.current };
    return {
      ...node,
      computed,
    };
  });
}
