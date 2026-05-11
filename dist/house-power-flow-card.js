var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __decorateClass = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result) __defProp(target, key, result);
  return result;
};

// src/house-power-flow-card.ts
import { LitElement, html, svg } from "lit";
import { customElement, property, state } from "lit/decorators.js";

// src/core/graph.ts
function findRootIds(nodes, rootId) {
  if (rootId) return [rootId];
  const ids = new Set(nodes.map((node) => node.id));
  return nodes.filter((node) => !node.parent || !ids.has(node.parent)).map((node) => node.id);
}
function buildChildrenMap(nodes) {
  const children = /* @__PURE__ */ new Map();
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
function layoutTree(nodes, rootIds, childrenMap) {
  const levels = [];
  const visited = /* @__PURE__ */ new Set();
  const queue = rootIds.map((id) => ({ id, level: 0 }));
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
  const width = 1e3;
  const height = Math.max(360, levels.reduce((max, level) => Math.max(max, level.length * 120), 0) + 80);
  const positions = /* @__PURE__ */ new Map();
  for (let levelIndex = 0; levelIndex < levels.length; levelIndex += 1) {
    const nodeIds = levels[levelIndex] ?? [];
    const x = levels.length === 1 ? width / 2 : 120 + levelIndex * (width - 240) / (levels.length - 1);
    for (let rowIndex = 0; rowIndex < nodeIds.length; rowIndex += 1) {
      const id = nodeIds[rowIndex];
      if (!id) continue;
      const y = nodeIds.length === 1 ? height / 2 : 60 + rowIndex * (height - 120) / (nodeIds.length - 1);
      positions.set(id, { x, y });
    }
  }
  return { width, height, positions };
}

// src/core/ha.ts
function entityToNumber(hass, entityId) {
  if (!hass || !entityId) return null;
  const state2 = hass.states[entityId]?.state;
  if (state2 === void 0) return null;
  const value = Number(state2);
  return Number.isFinite(value) ? value : null;
}
function entityToText(hass, entityId) {
  if (!hass || !entityId) return null;
  return hass.states[entityId]?.state ?? null;
}

// src/core/flow.ts
function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}
function getEdgeFlow(node, minActivePower) {
  const power = node.computed.power;
  const current = node.computed.current;
  const state2 = (node.live.state ?? "").toLowerCase();
  const activeByPower = power !== null && Math.abs(power) >= minActivePower;
  const activeByCurrent = current !== null && Math.abs(current) > 0.01;
  const activeByState = ["on", "true", "1", "closed"].includes(state2);
  const intensity = Math.max(Math.abs(power ?? 0), Math.abs((current ?? 0) * 230));
  const normalized = clamp(intensity / 8e3, 0, 1);
  const speedSeconds = 2.4 - normalized * 1.9;
  return {
    active: activeByPower || activeByCurrent || activeByState,
    reverse: power !== null && power < 0,
    speedSeconds,
    bidirectional: node.bidirectional_with_parent
  };
}

// src/styles/card-styles.ts
import { css } from "lit";
var cardStyles = css`
  :host {
    display: block;
  }

  .wrapper {
    padding: 14px;
    background:
      radial-gradient(circle at 8% 0%, rgba(56, 189, 248, 0.18), transparent 35%),
      radial-gradient(circle at 90% 0%, rgba(16, 185, 129, 0.16), transparent 35%),
      linear-gradient(180deg, rgba(12, 16, 24, 0.04), rgba(12, 16, 24, 0.01));
    border-radius: 14px;
  }

  .hero {
    display: flex;
    justify-content: space-between;
    gap: 12px;
    align-items: flex-start;
    margin-bottom: 12px;
    flex-wrap: wrap;
  }

  .title {
    font-size: 21px;
    font-weight: 800;
    letter-spacing: 0.01em;
    margin-bottom: 4px;
  }

  .subtitle {
    font-size: 12px;
    color: var(--secondary-text-color);
  }

  .toolbar {
    margin-bottom: 10px;
  }

  .edit-btn {
    border: 1px solid rgba(14, 165, 233, 0.35);
    background: rgba(14, 165, 233, 0.12);
    color: #0f172a;
    font-size: 12px;
    font-weight: 700;
    padding: 7px 12px;
    border-radius: 999px;
    cursor: pointer;
  }

  .edit-btn:hover {
    background: rgba(14, 165, 233, 0.2);
  }

  .kpis {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
  }

  .kpi {
    min-width: 108px;
    border-radius: 10px;
    padding: 8px 10px;
    background: rgba(255, 255, 255, 0.75);
    border: 1px solid rgba(120, 130, 150, 0.22);
    box-shadow: 0 4px 10px rgba(15, 23, 42, 0.08);
  }

  .kpi.ok {
    border-color: rgba(16, 185, 129, 0.4);
  }

  .kpi.alert {
    border-color: rgba(239, 68, 68, 0.42);
    background: rgba(254, 242, 242, 0.92);
  }

  .kpi-label {
    font-size: 11px;
    color: var(--secondary-text-color);
    margin-bottom: 3px;
  }

  .kpi-value {
    font-size: 18px;
    font-weight: 800;
  }

  .phase-legend {
    display: flex;
    gap: 8px;
    margin-bottom: 10px;
    flex-wrap: wrap;
  }

  .phase-chip {
    display: inline-flex;
    padding: 4px 9px;
    border-radius: 999px;
    font-size: 11px;
    font-weight: 700;
    border: 1px solid transparent;
  }

  .phase-chip.l1 {
    background: rgba(239, 68, 68, 0.12);
    border-color: rgba(239, 68, 68, 0.35);
  }

  .phase-chip.l2 {
    background: rgba(59, 130, 246, 0.12);
    border-color: rgba(59, 130, 246, 0.35);
  }

  .phase-chip.l3 {
    background: rgba(16, 185, 129, 0.12);
    border-color: rgba(16, 185, 129, 0.35);
  }

  .graph {
    position: relative;
    width: 100%;
    border-radius: 14px;
    overflow: hidden;
    border: 1px solid rgba(120, 130, 150, 0.24);
    margin-bottom: 14px;
    background:
      linear-gradient(180deg, rgba(11, 17, 32, 0.07), rgba(11, 17, 32, 0.01)),
      repeating-linear-gradient(90deg, rgba(148, 163, 184, 0.05) 0, rgba(148, 163, 184, 0.05) 1px, transparent 1px, transparent 28px);
  }

  .graph-glow {
    position: absolute;
    inset: 0;
    background: radial-gradient(circle at 30% 15%, rgba(34, 197, 94, 0.1), transparent 30%);
    pointer-events: none;
  }

  svg {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
  }

  .edge {
    fill: none;
    stroke: rgba(100, 116, 139, 0.45);
    stroke-linecap: round;
  }

  .edge.active {
    stroke: #22c55e;
    stroke-dasharray: 11 8;
    animation: flow 1s linear infinite;
    filter: drop-shadow(0 0 5px rgba(34, 197, 94, 0.65));
  }

  .phase-label {
    font-size: 10px;
    font-weight: 700;
    fill: rgba(15, 23, 42, 0.8);
    paint-order: stroke;
    stroke: rgba(255, 255, 255, 0.9);
    stroke-width: 3;
  }

  .edge.phase-l1,
  .panel-edge.phase-l1 {
    stroke: rgba(239, 68, 68, 0.6);
  }

  .edge.phase-l2,
  .panel-edge.phase-l2 {
    stroke: rgba(59, 130, 246, 0.6);
  }

  .edge.phase-l3,
  .panel-edge.phase-l3 {
    stroke: rgba(16, 185, 129, 0.6);
  }

  .flow-dot {
    fill: #22c55e;
    filter: drop-shadow(0 0 4px rgba(34, 197, 94, 0.9));
  }

  .flow-dot.reverse {
    fill: #0ea5e9;
    filter: drop-shadow(0 0 4px rgba(14, 165, 233, 0.9));
  }

  .flow-dot.panel {
    fill: #f59e0b;
    filter: drop-shadow(0 0 3px rgba(245, 158, 11, 0.85));
  }

  .node {
    position: absolute;
    transform: translate(-50%, -50%);
    width: 186px;
    min-height: 74px;
    padding: 9px 10px;
    border-radius: 12px;
    backdrop-filter: blur(3px);
    border: 1px solid rgba(120, 130, 150, 0.4);
    background: rgba(255, 255, 255, 0.87);
    box-shadow: 0 8px 16px rgba(15, 23, 42, 0.12);
    z-index: 2;
  }

  .node-head,
  .slot-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 8px;
  }

  .node-name {
    font-size: 13px;
    font-weight: 800;
    margin-bottom: 4px;
  }

  .load-kind {
    font-size: 10px;
    font-weight: 700;
    color: #334155;
    margin-bottom: 4px;
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }

  .node-metrics {
    font-size: 11px;
    line-height: 1.3;
    color: var(--secondary-text-color);
  }

  .status-dot {
    width: 9px;
    height: 9px;
    border-radius: 50%;
    display: inline-block;
    box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.8);
  }

  .status-dot.on {
    background: #22c55e;
  }

  .status-dot.off {
    background: #94a3b8;
  }

  .status-dot.alert {
    background: #ef4444;
    box-shadow: 0 0 8px rgba(239, 68, 68, 0.8);
  }

  .node.off,
  .panel-slot.off {
    opacity: 0.75;
  }

  .node.alert,
  .panel-slot.alert {
    border-color: rgba(239, 68, 68, 0.6);
    box-shadow: 0 8px 16px rgba(239, 68, 68, 0.24);
  }

  .panels {
    display: grid;
    gap: 12px;
  }

  .panel {
    border: 1px solid rgba(120, 130, 150, 0.28);
    border-radius: 14px;
    padding: 10px;
    background: linear-gradient(160deg, rgba(255, 255, 255, 0.9), rgba(244, 248, 255, 0.86)), radial-gradient(circle at 100% 0%, rgba(59, 130, 246, 0.08), transparent 45%);
    box-shadow: 0 8px 20px rgba(15, 23, 42, 0.06);
  }

  .panel-top {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    gap: 10px;
    margin-bottom: 8px;
  }

  .panel-title {
    font-size: 14px;
    font-weight: 800;
  }

  .panel-usage {
    font-size: 12px;
    color: var(--secondary-text-color);
  }

  .usage-track {
    height: 6px;
    border-radius: 999px;
    background: rgba(148, 163, 184, 0.24);
    overflow: hidden;
    margin-bottom: 10px;
  }

  .usage-fill {
    height: 100%;
    border-radius: inherit;
    background: linear-gradient(90deg, #22c55e, #0ea5e9);
  }

  .panel-shell {
    position: relative;
  }

  .panel-links {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
    pointer-events: none;
  }

  .panel-edge {
    fill: none;
    stroke-width: 2.2;
    stroke: rgba(100, 116, 139, 0.5);
    stroke-dasharray: 6 5;
  }

  .panel-edge.active {
    stroke-width: 2.8;
    filter: drop-shadow(0 0 3px rgba(14, 165, 233, 0.7));
  }

  .panel-grid {
    display: grid;
    gap: 8px;
    position: relative;
    z-index: 2;
  }

  .panel-slot {
    border: 1px solid rgba(120, 130, 150, 0.35);
    border-radius: 9px;
    padding: 8px;
    min-height: 82px;
    background: rgba(255, 255, 255, 0.9);
  }

  .panel-slot.draggable {
    cursor: grab;
  }

  .panel-slot.dropzone:hover {
    border-color: rgba(14, 165, 233, 0.55);
    background: rgba(14, 165, 233, 0.08);
  }

  .panel-slot.empty {
    opacity: 0.6;
    border-style: dashed;
  }

  .slot-label {
    font-size: 11px;
    font-weight: 700;
    color: var(--secondary-text-color);
    margin-bottom: 4px;
  }

  .slot-name {
    font-size: 13px;
    font-weight: 700;
    margin-bottom: 4px;
  }

  .slot-metrics,
  .slot-empty {
    font-size: 11px;
    color: var(--secondary-text-color);
    line-height: 1.25;
  }

  .yaml-preview {
    margin-top: 12px;
    border-radius: 12px;
    border: 1px solid rgba(120, 130, 150, 0.35);
    background: rgba(248, 250, 252, 0.92);
    overflow: hidden;
  }

  .yaml-title {
    font-size: 12px;
    font-weight: 800;
    padding: 8px 10px;
    border-bottom: 1px solid rgba(120, 130, 150, 0.22);
    background: rgba(226, 232, 240, 0.55);
  }

  .yaml-preview pre {
    margin: 0;
    padding: 10px;
    font-size: 11px;
    line-height: 1.4;
    overflow: auto;
    white-space: pre;
  }

  .node.main_breaker,
  .node.breaker,
  .node.input,
  .panel-slot.main_breaker,
  .panel-slot.breaker,
  .panel-slot.input {
    border-left: 5px solid #ef4444;
  }

  .node.grid,
  .node.line,
  .node.bus,
  .panel-slot.grid,
  .panel-slot.line,
  .panel-slot.bus {
    border-left: 5px solid #3b82f6;
  }

  .node.inverter,
  .node.load,
  .node.device,
  .node.relay,
  .panel-slot.inverter,
  .panel-slot.load,
  .panel-slot.device,
  .panel-slot.relay {
    border-left: 5px solid #22c55e;
  }

  .node.battery,
  .node.solar,
  .panel-slot.battery,
  .panel-slot.solar {
    border-left: 5px solid #f59e0b;
  }

  @keyframes flow {
    from {
      stroke-dashoffset: 0;
    }
    to {
      stroke-dashoffset: -38;
    }
  }

  @media (max-width: 740px) {
    .node {
      width: 156px;
      min-height: 68px;
    }

    .kpi {
      min-width: 92px;
    }
  }
`;

// src/core/topology.ts
function sumOrNull(values) {
  const numeric = values.filter((value) => value !== null);
  if (!numeric.length) return null;
  return numeric.reduce((acc, value) => acc + value, 0);
}
function sumPositive(values) {
  const positive = values.filter((value) => value !== null && value > 0);
  if (!positive.length) return null;
  return positive.reduce((acc, value) => acc + value, 0);
}
function computeTopologyMetrics(nodes, childrenMap) {
  const nodeMap = new Map(nodes.map((node) => [node.id, node]));
  const computedCache = /* @__PURE__ */ new Map();
  const dfs = (nodeId, stack) => {
    if (computedCache.has(nodeId)) return computedCache.get(nodeId);
    if (stack.has(nodeId)) {
      const node2 = nodeMap.get(nodeId);
      return {
        power: node2?.live.power ?? null,
        current: node2?.live.current ?? null
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
    const result = node.type === "grid" ? {
      power: sumPositive(childComputed.map((m) => m.power)) ?? 0,
      current: sumPositive(childComputed.map((m) => m.current)) ?? 0
    } : {
      power: node.live.power ?? childPowerSum,
      current: node.live.current ?? childCurrentSum
    };
    computedCache.set(nodeId, result);
    stack.delete(nodeId);
    return result;
  };
  for (const node of nodes) {
    dfs(node.id, /* @__PURE__ */ new Set());
  }
  return nodes.map((node) => {
    const computed = computedCache.get(node.id) ?? { power: node.live.power, current: node.live.current };
    return {
      ...node,
      computed
    };
  });
}

// src/house-power-flow-card.ts
var HousePowerFlowCard = class extends LitElement {
  constructor() {
    super(...arguments);
    this.editMode = false;
    this.dragNodeId = null;
  }
  setConfig(config) {
    if (!config?.nodes?.length) {
      throw new Error("You need to define 'nodes' as a non-empty array.");
    }
    this.config = {
      title: config.title ?? "House Power Flow",
      root_id: config.root_id,
      min_active_power: Number.isFinite(config.min_active_power) ? config.min_active_power : 10,
      line_width: Number.isFinite(config.line_width) ? config.line_width : 4,
      max_expected_power: Number.isFinite(config.max_expected_power) ? config.max_expected_power : 15e3,
      panels: (config.panels ?? []).map((panel) => ({
        ...panel,
        slots: Math.max(1, panel.slots),
        columns: panel.columns && panel.columns > 0 ? Math.floor(panel.columns) : void 0
      })),
      nodes: config.nodes.map((node) => ({
        ...node,
        name: node.name ?? node.id,
        type: node.type ?? "load",
        load_kind: node.load_kind ?? "other",
        phase: node.phase ?? "L1",
        rated_power: Number.isFinite(node.rated_power) ? node.rated_power ?? null : null,
        bidirectional_with_parent: Boolean(node.bidirectional_with_parent),
        live: { power: null, current: null, voltage: null, state: null },
        computed: { power: null, current: null }
      }))
    };
  }
  getCardSize() {
    return 9;
  }
  phaseClass(phase) {
    return phase.toLowerCase();
  }
  formatMetrics(node) {
    const metrics = [];
    const power = node.live.power ?? node.computed.power;
    const current = node.live.current ?? node.computed.current;
    if (power !== null) metrics.push(`${power.toFixed(0)} W`);
    if (current !== null) metrics.push(`${current.toFixed(1)} A`);
    if (node.live.voltage !== null) metrics.push(`${node.live.voltage.toFixed(0)} V`);
    if (node.rated_power !== null) metrics.push(`Rated: ${node.rated_power} W`);
    if (node.live.state !== null) metrics.push(`State: ${node.live.state}`);
    return metrics;
  }
  nodeStateClass(node) {
    const state2 = (node.live.state ?? "").toLowerCase();
    const power = node.live.power ?? node.computed.power;
    if (["fault", "alarm", "trip", "error"].includes(state2)) return "alert";
    if (power !== null && power > this.config.max_expected_power) return "alert";
    if (["off", "false", "0", "open"].includes(state2)) return "off";
    return "on";
  }
  loadKindLabel(node) {
    if (node.type !== "load") return "";
    const map = {
      boiler: "Boiler",
      pump: "Pump",
      fridge: "Fridge",
      tv: "TV",
      router: "Router",
      heater: "Heater",
      lighting: "Lighting",
      socket: "Socket",
      other: "Load"
    };
    return map[node.load_kind] ?? "Load";
  }
  toggleEditMode() {
    this.editMode = !this.editMode;
  }
  onDragStart(nodeId) {
    if (!this.editMode) return;
    this.dragNodeId = nodeId;
  }
  onDrop(panelId, slot) {
    if (!this.config || !this.dragNodeId) return;
    const draggedNode = this.config.nodes.find((n) => n.id === this.dragNodeId);
    if (!draggedNode) return;
    const occupant = this.config.nodes.find((n) => n.panel_id === panelId && n.panel_slot === slot);
    const prevPanel = draggedNode.panel_id;
    const prevSlot = draggedNode.panel_slot;
    draggedNode.panel_id = panelId;
    draggedNode.panel_slot = slot;
    if (occupant && occupant.id !== draggedNode.id) {
      occupant.panel_id = prevPanel;
      occupant.panel_slot = prevSlot;
    }
    this.dragNodeId = null;
    this.requestUpdate();
  }
  onDragOver(event) {
    if (!this.editMode) return;
    event.preventDefault();
  }
  generateYamlPreview() {
    if (!this.config) return "";
    const lines = [];
    lines.push("panels:");
    for (const panel of this.config.panels) {
      lines.push(`  - id: ${panel.id}`);
      lines.push(`    name: ${panel.name}`);
      lines.push(`    slots: ${panel.slots}`);
      if (panel.columns) lines.push(`    columns: ${panel.columns}`);
    }
    lines.push("");
    lines.push("nodes:");
    for (const node of this.config.nodes) {
      lines.push(`  - id: ${node.id}`);
      lines.push(`    name: ${node.name}`);
      lines.push(`    type: ${node.type}`);
      if (node.parent) lines.push(`    parent: ${node.parent}`);
      if (node.panel_id) lines.push(`    panel_id: ${node.panel_id}`);
      if (Number.isFinite(node.panel_slot)) lines.push(`    panel_slot: ${node.panel_slot}`);
      if (node.phase) lines.push(`    phase: ${node.phase}`);
      if (node.type === "load") lines.push(`    load_kind: ${node.load_kind}`);
      if (node.rated_power !== null) lines.push(`    rated_power: ${node.rated_power}`);
      if (node.bidirectional_with_parent) lines.push("    bidirectional_with_parent: true");
    }
    return lines.join("\n");
  }
  render() {
    if (!this.config) return html``;
    const liveNodes = this.config.nodes.map((node) => ({
      ...node,
      live: {
        power: entityToNumber(this.hass, node.power),
        current: entityToNumber(this.hass, node.current),
        voltage: entityToNumber(this.hass, node.voltage),
        state: entityToText(this.hass, node.state)
      }
    }));
    const childrenMap = buildChildrenMap(liveNodes);
    const nodes = computeTopologyMetrics(liveNodes, childrenMap);
    const nodeMap = new Map(nodes.map((node) => [node.id, node]));
    const rootIds = findRootIds(nodes, this.config.root_id).filter((id) => nodeMap.has(id));
    const layout = layoutTree(nodes, rootIds, buildChildrenMap(nodes));
    const edges = nodes.filter((node) => node.parent && nodeMap.has(node.parent)).map((node) => {
      const parentPosition = node.parent ? layout.positions.get(node.parent) : void 0;
      const childPosition = layout.positions.get(node.id);
      if (!parentPosition || !childPosition) return null;
      const flow = getEdgeFlow(node, this.config.min_active_power);
      const classes = [
        "edge",
        flow.active ? "active" : "",
        flow.reverse ? "reverse" : "",
        flow.bidirectional ? "bidirectional" : "",
        `phase-${this.phaseClass(node.phase)}`
      ].filter(Boolean).join(" ");
      const pathId = `edge-${node.id}`;
      const d = `M ${parentPosition.x + 90} ${parentPosition.y} C ${parentPosition.x + 140} ${parentPosition.y}, ${childPosition.x - 140} ${childPosition.y}, ${childPosition.x - 90} ${childPosition.y}`;
      return svg`
          <path id=${pathId} class=${classes} style=${`stroke-width:${this.config.line_width}`} d=${d} marker-end="url(#arrow)" />
          ${flow.active ? svg`
                <circle class="flow-dot" r="4">
                  <animateMotion dur=${`${flow.speedSeconds}s`} repeatCount="indefinite" rotate="auto">
                    <mpath href=${`#${pathId}`}></mpath>
                  </animateMotion>
                </circle>
                ${flow.bidirectional ? svg`
                      <circle class="flow-dot reverse" r="4">
                        <animateMotion dur=${`${flow.speedSeconds}s`} repeatCount="indefinite" rotate="auto-reverse">
                          <mpath href=${`#${pathId}`}></mpath>
                        </animateMotion>
                      </circle>
                    ` : svg``}
              ` : svg``}
          <text class="phase-label" x=${(parentPosition.x + childPosition.x) / 2} y=${(parentPosition.y + childPosition.y) / 2 - 8}>${node.phase}</text>
        `;
    });
    const panelNodeIds = new Set(nodes.filter((node) => node.panel_id && Number.isFinite(node.panel_slot)).map((node) => node.id));
    const freeNodes = nodes.filter((node) => !panelNodeIds.has(node.id));
    const totalPower = nodes.reduce((sum, node) => sum + (node.computed.power && node.computed.power > 0 ? node.computed.power : 0), 0);
    const pvGeneration = nodes.filter((n) => n.type === "solar").reduce((sum, n) => sum + Math.max(0, n.computed.power ?? 0), 0);
    const batteryPowerNet = nodes.filter((n) => n.type === "battery").reduce((sum, n) => sum + (n.computed.power ?? 0), 0);
    const batteryCharge = Math.max(0, -batteryPowerNet);
    const batteryDischarge = Math.max(0, batteryPowerNet);
    const gridNodes = nodes.filter((n) => n.type === "grid");
    const gridImport = gridNodes.reduce((sum, n) => sum + Math.max(0, n.computed.power ?? 0), 0);
    const gridExport = nodes.filter((n) => n.parent && gridNodes.some((g) => g.id === n.parent)).reduce((sum, n) => sum + Math.max(0, -(n.computed.power ?? 0)), 0);
    const activeFlows = nodes.filter((node) => node.parent && getEdgeFlow(node, this.config.min_active_power).active).length;
    const alertCount = nodes.filter((node) => this.nodeStateClass(node) === "alert").length;
    const phaseTotals = { L1: 0, L2: 0, L3: 0 };
    for (const node of nodes) {
      if (node.computed.power && node.computed.power > 0) phaseTotals[node.phase] += node.computed.power;
    }
    const activePhases = Object.values(phaseTotals).filter((v) => v > 0).length || 1;
    const avg = (phaseTotals.L1 + phaseTotals.L2 + phaseTotals.L3) / activePhases;
    const maxDev = Math.max(Math.abs(phaseTotals.L1 - avg), Math.abs(phaseTotals.L2 - avg), Math.abs(phaseTotals.L3 - avg));
    const phaseImbalancePct = avg > 0 ? maxDev / avg * 100 : 0;
    return html`
      <ha-card>
        <div class="wrapper">
          <div class="hero">
            <div>
              <div class="title">${this.config.title}</div>
              <div class="subtitle">Live topology and switchboard monitoring</div>
            </div>
            <div class="kpis">
              <div class="kpi"><div class="kpi-label">Total Load</div><div class="kpi-value">${totalPower.toFixed(0)} W</div></div>
              <div class="kpi"><div class="kpi-label">PV Gen</div><div class="kpi-value">${pvGeneration.toFixed(0)} W</div></div>
              <div class="kpi"><div class="kpi-label">Battery +</div><div class="kpi-value">${batteryDischarge.toFixed(0)} W</div></div>
              <div class="kpi"><div class="kpi-label">Battery -</div><div class="kpi-value">${batteryCharge.toFixed(0)} W</div></div>
              <div class="kpi"><div class="kpi-label">Grid Import</div><div class="kpi-value">${gridImport.toFixed(0)} W</div></div>
              <div class="kpi"><div class="kpi-label">Grid Export</div><div class="kpi-value">${gridExport.toFixed(0)} W</div></div>
              <div class="kpi"><div class="kpi-label">Active Flows</div><div class="kpi-value">${activeFlows}</div></div>
              <div class="kpi"><div class="kpi-label">Phase Δ</div><div class="kpi-value">${phaseImbalancePct.toFixed(1)}%</div></div>
              <div class=${`kpi ${alertCount > 0 ? "alert" : "ok"}`}><div class="kpi-label">Alerts</div><div class="kpi-value">${alertCount}</div></div>
            </div>
          </div>

          <div class="toolbar">
            <button class="edit-btn" @click=${this.toggleEditMode}>${this.editMode ? "Exit Configurator" : "Open Configurator"}</button>
          </div>

          <div class="phase-legend">
            <span class="phase-chip l1">L1 ${phaseTotals.L1.toFixed(0)} W</span>
            <span class="phase-chip l2">L2 ${phaseTotals.L2.toFixed(0)} W</span>
            <span class="phase-chip l3">L3 ${phaseTotals.L3.toFixed(0)} W</span>
          </div>

          <div class="graph" style=${`height:${layout.height}px`}>
            <div class="graph-glow"></div>
            <svg viewBox=${`0 0 ${layout.width} ${layout.height}`} preserveAspectRatio="none">
              <defs><marker id="arrow" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto"><path d="M 0 0 L 10 5 L 0 10 z" fill="var(--primary-text-color)" opacity="0.75" /></marker></defs>
              ${edges}
            </svg>

            ${freeNodes.map((node) => {
      const pos = layout.positions.get(node.id);
      if (!pos) return html``;
      const metrics = this.formatMetrics(node);
      const statusClass = this.nodeStateClass(node);
      const loadKind = this.loadKindLabel(node);
      return html`
                <div class=${`node ${node.type} ${statusClass}`} style=${`left:${pos.x}px; top:${pos.y}px;`}>
                  <div class="node-head"><div class="node-name">${node.name}</div><span class=${`status-dot ${statusClass}`}></span></div>
                  ${loadKind ? html`<div class="load-kind">${loadKind}</div>` : html``}
                  <div class="node-metrics">${metrics.length ? metrics.join(" | ") : "No data"}</div>
                </div>
              `;
    })}
          </div>

          ${this.config.panels.length ? html`
                <div class="panels">
                  ${this.config.panels.map((panel) => {
      const panelNodes = nodes.filter((node) => node.panel_id === panel.id);
      const slotCount = panel.slots;
      const columns = panel.columns && panel.columns > 0 ? panel.columns : Math.min(slotCount, 4);
      const occupied = panelNodes.filter((node) => Number.isFinite(node.panel_slot)).length;
      const usage = Math.min(100, occupied / slotCount * 100);
      const slotNodeMap = new Map(panelNodes.map((node) => [node.panel_slot, node]));
      const panelEdges = panelNodes.filter((node) => node.parent && panelNodes.some((candidate) => candidate.id === node.parent));
      return html`
                      <div class="panel">
                        <div class="panel-top"><div class="panel-title">${panel.name}</div><div class="panel-usage">${occupied}/${slotCount} slots</div></div>
                        <div class="usage-track"><div class="usage-fill" style=${`width:${usage}%`}></div></div>
                        <div class="panel-shell">
                          <svg class="panel-links" viewBox="0 0 1000 260" preserveAspectRatio="none">
                            ${panelEdges.map((node) => {
        const childSlot = node.panel_slot ?? 1;
        const parentNode = panelNodes.find((candidate) => candidate.id === node.parent);
        const parentSlot = parentNode?.panel_slot ?? childSlot;
        const flow = getEdgeFlow(node, this.config.min_active_power);
        const col = columns;
        const cellW = 1e3 / col;
        const rows = Math.ceil(slotCount / col);
        const cellH = 260 / Math.max(rows, 1);
        const pCol = (parentSlot - 1) % col;
        const pRow = Math.floor((parentSlot - 1) / col);
        const cCol = (childSlot - 1) % col;
        const cRow = Math.floor((childSlot - 1) / col);
        const x1 = pCol * cellW + cellW / 2;
        const y1 = pRow * cellH + cellH / 2;
        const x2 = cCol * cellW + cellW / 2;
        const y2 = cRow * cellH + cellH / 2;
        const d = `M ${x1} ${y1} C ${(x1 + x2) / 2} ${y1}, ${(x1 + x2) / 2} ${y2}, ${x2} ${y2}`;
        const pid = `panel-edge-${panel.id}-${node.id}`;
        return svg`
                                <path id=${pid} class=${`panel-edge ${flow.active ? "active" : ""} phase-${this.phaseClass(node.phase)}`} d=${d}></path>
                                ${flow.active ? svg`
                                      <circle class="flow-dot panel" r="3"><animateMotion dur=${`${flow.speedSeconds}s`} repeatCount="indefinite" rotate="auto"><mpath href=${`#${pid}`}></mpath></animateMotion></circle>
                                      ${flow.bidirectional ? svg`<circle class="flow-dot panel reverse" r="3"><animateMotion dur=${`${flow.speedSeconds}s`} repeatCount="indefinite" rotate="auto-reverse"><mpath href=${`#${pid}`}></mpath></animateMotion></circle>` : svg``}
                                    ` : svg``}
                              `;
      })}
                          </svg>

                          <div class="panel-grid" style=${`grid-template-columns: repeat(${columns}, minmax(120px, 1fr));`}>
                            ${Array.from({ length: slotCount }, (_, index) => {
        const slot = index + 1;
        const slotNode = slotNodeMap.get(slot);
        if (!slotNode) {
          return html`<div class="panel-slot empty dropzone" @dragover=${this.onDragOver} @drop=${() => this.onDrop(panel.id, slot)}><div class="slot-label">Slot ${slot}</div><div class="slot-empty">пусто</div></div>`;
        }
        const metrics = this.formatMetrics(slotNode);
        const statusClass = this.nodeStateClass(slotNode);
        const loadKind = this.loadKindLabel(slotNode);
        return html`
                                <div
                                  class=${`panel-slot filled ${slotNode.type} ${statusClass} ${this.editMode ? "draggable" : ""}`}
                                  draggable=${this.editMode}
                                  @dragstart=${() => this.onDragStart(slotNode.id)}
                                  @dragover=${this.onDragOver}
                                  @drop=${() => this.onDrop(panel.id, slot)}
                                >
                                  <div class="slot-top"><div class="slot-label">Slot ${slot} · ${slotNode.phase}</div><span class=${`status-dot ${statusClass}`}></span></div>
                                  <div class="slot-name">${slotNode.name}</div>
                                  ${loadKind ? html`<div class="load-kind">${loadKind}</div>` : html``}
                                  <div class="slot-metrics">${metrics.length ? metrics.join(" | ") : "No data"}</div>
                                </div>
                              `;
      })}
                          </div>
                        </div>
                      </div>
                    `;
    })}
                </div>
              ` : html``}

          ${this.editMode ? html`
                <div class="yaml-preview">
                  <div class="yaml-title">Configurator YAML Preview</div>
                  <pre>${this.generateYamlPreview()}</pre>
                </div>
              ` : html``}
        </div>
      </ha-card>
    `;
  }
};
HousePowerFlowCard.styles = cardStyles;
__decorateClass([
  property({ attribute: false })
], HousePowerFlowCard.prototype, "hass", 2);
__decorateClass([
  state()
], HousePowerFlowCard.prototype, "config", 2);
__decorateClass([
  state()
], HousePowerFlowCard.prototype, "editMode", 2);
__decorateClass([
  state()
], HousePowerFlowCard.prototype, "dragNodeId", 2);
HousePowerFlowCard = __decorateClass([
  customElement("house-power-flow-card")
], HousePowerFlowCard);

// src/index.ts
window.customCards = window.customCards ?? [];
if (!window.customCards.find((card) => card.type === "house-power-flow-card")) {
  window.customCards.push({
    type: "house-power-flow-card",
    name: "House Power Flow Card",
    description: "Build your home electrical topology and show live power flow."
  });
}
//# sourceMappingURL=house-power-flow-card.js.map