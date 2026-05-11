import type { EdgeFlow, PowerNode } from "../model/types";

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

export function getEdgeFlow(node: PowerNode, minActivePower: number): EdgeFlow {
  const power = node.computed.power;
  const current = node.computed.current;
  const state = (node.live.state ?? "").toLowerCase();

  const activeByPower = power !== null && Math.abs(power) >= minActivePower;
  const activeByCurrent = current !== null && Math.abs(current) > 0.01;
  const activeByState = ["on", "true", "1", "closed"].includes(state);

  const intensity = Math.max(Math.abs(power ?? 0), Math.abs((current ?? 0) * 230));
  const normalized = clamp(intensity / 8000, 0, 1);
  const speedSeconds = 2.4 - normalized * 1.9;

  return {
    active: activeByPower || activeByCurrent || activeByState,
    reverse: power !== null && power < 0,
    speedSeconds,
    bidirectional: node.bidirectional_with_parent,
  };
}
