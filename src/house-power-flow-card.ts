import { LitElement, html, svg } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { buildChildrenMap, findRootIds, layoutTree } from "./core/graph";
import { entityToNumber, entityToText } from "./core/ha";
import { getEdgeFlow } from "./core/flow";
import { cardStyles } from "./styles/card-styles";
import { computeTopologyMetrics } from "./core/topology";
import type { CardConfig, HomeAssistant, PanelConfig, Phase, PowerNode } from "./model/types";

interface InternalConfig {
  title: string;
  root_id?: string;
  min_active_power: number;
  line_width: number;
  max_expected_power: number;
  nodes: PowerNode[];
  panels: PanelConfig[];
}

@customElement("house-power-flow-card")
export class HousePowerFlowCard extends LitElement {
  static styles = cardStyles;

  @property({ attribute: false }) public hass?: HomeAssistant;

  @state() private config?: InternalConfig;
  @state() private editMode = false;
  @state() private dragNodeId: string | null = null;

  public setConfig(config: CardConfig): void {
    if (!config?.nodes?.length) {
      throw new Error("You need to define 'nodes' as a non-empty array.");
    }

    this.config = {
      title: config.title ?? "House Power Flow",
      root_id: config.root_id,
      min_active_power: Number.isFinite(config.min_active_power) ? config.min_active_power : 10,
      line_width: Number.isFinite(config.line_width) ? config.line_width : 4,
      max_expected_power: Number.isFinite(config.max_expected_power) ? config.max_expected_power : 15000,
      panels: (config.panels ?? []).map((panel) => ({
        ...panel,
        slots: Math.max(1, panel.slots),
        columns: panel.columns && panel.columns > 0 ? Math.floor(panel.columns) : undefined,
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
        computed: { power: null, current: null },
      })),
    };
  }

  public getCardSize(): number {
    return 12;
  }

  private phaseClass(phase: Phase): string {
    return phase.toLowerCase();
  }

  private formatMetrics(node: PowerNode): string[] {
    const metrics: string[] = [];
    const power = node.live.power ?? node.computed.power;
    const current = node.live.current ?? node.computed.current;

    if (power !== null) metrics.push(`${power.toFixed(0)} W`);
    if (current !== null) metrics.push(`${current.toFixed(1)} A`);
    if (node.live.voltage !== null) metrics.push(`${node.live.voltage.toFixed(0)} V`);
    if (node.rated_power !== null) metrics.push(`Rated: ${node.rated_power} W`);
    if (node.live.state !== null) metrics.push(`State: ${node.live.state}`);
    return metrics;
  }

  private nodeStateClass(node: PowerNode): "on" | "off" | "alert" {
    const state = (node.live.state ?? "").toLowerCase();
    const power = node.live.power ?? node.computed.power;

    if (["fault", "alarm", "trip", "error"].includes(state)) return "alert";
    if (power !== null && power > this.config!.max_expected_power) return "alert";
    if (["off", "false", "0", "open"].includes(state)) return "off";
    return "on";
  }

  private loadKindLabel(node: PowerNode): string {
    if (node.type !== "load") return "";
    const map: Record<string, string> = {
      boiler: "Boiler",
      pump: "Pump",
      fridge: "Fridge",
      tv: "TV",
      router: "Router",
      heater: "Heater",
      lighting: "Lighting",
      socket: "Socket",
      other: "Load",
    };
    return map[node.load_kind] ?? "Load";
  }

  private toggleEditMode(): void {
    this.editMode = !this.editMode;
  }

  private onDragStart(nodeId: string): void {
    if (!this.editMode) return;
    this.dragNodeId = nodeId;
  }

  private onDrop(panelId: string, slot: number): void {
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

  private onDragOver(event: DragEvent): void {
    if (!this.editMode) return;
    event.preventDefault();
  }

  private generateYamlPreview(): string {
    if (!this.config) return "";

    const lines: string[] = [];
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

  protected render() {
    if (!this.config) return html``;

    const liveNodes = this.config.nodes.map((node) => ({
      ...node,
      live: {
        power: entityToNumber(this.hass, node.power),
        current: entityToNumber(this.hass, node.current),
        voltage: entityToNumber(this.hass, node.voltage),
        state: entityToText(this.hass, node.state),
      },
    }));

    const childrenMap = buildChildrenMap(liveNodes);
    const nodes = computeTopologyMetrics(liveNodes, childrenMap);

    const nodeMap = new Map(nodes.map((node) => [node.id, node]));
    const rootIds = findRootIds(nodes, this.config.root_id).filter((id) => nodeMap.has(id));
    const layout = layoutTree(nodes, rootIds, buildChildrenMap(nodes));

    const panelNodeIds = new Set(nodes.filter((node) => node.panel_id && Number.isFinite(node.panel_slot)).map((node) => node.id));
    const freeNodes = nodes.filter((node) => !panelNodeIds.has(node.id));

    const graphHeight = Math.min(520, Math.max(280, layout.height));

    // Only draw graph lines for nodes that are outside panels to avoid "floating" lines.
    const edges = nodes
      .filter((node) => node.parent && nodeMap.has(node.parent) && !panelNodeIds.has(node.id) && !panelNodeIds.has(node.parent))
      .map((node) => {
        const parentPosition = node.parent ? layout.positions.get(node.parent) : undefined;
        const childPosition = layout.positions.get(node.id);
        if (!parentPosition || !childPosition) return null;

        const flow = getEdgeFlow(node, this.config!.min_active_power);
        const classes = ["edge", flow.active ? "active" : "", flow.reverse ? "reverse" : "", `phase-${this.phaseClass(node.phase)}`]
          .filter(Boolean)
          .join(" ");

        const pathId = `edge-${node.id}`;
        const x1 = parentPosition.x + 92;
        const y1 = parentPosition.y;
        const x2 = childPosition.x - 92;
        const y2 = childPosition.y;
        const midX = (x1 + x2) / 2;
        const d = `M ${x1} ${y1} L ${midX} ${y1} L ${midX} ${y2} L ${x2} ${y2}`;

        return svg`
          <path id=${pathId} class=${classes} style=${`stroke-width:${this.config!.line_width}`} d=${d} marker-end="url(#arrow)" />
          ${flow.active
            ? svg`
                <circle class="flow-dot" r="4">
                  <animateMotion dur=${`${flow.speedSeconds}s`} repeatCount="indefinite" rotate="auto"><mpath href=${`#${pathId}`}></mpath></animateMotion>
                </circle>
              `
            : svg``}
          <text class="phase-label" x=${(parentPosition.x + childPosition.x) / 2} y=${(parentPosition.y + childPosition.y) / 2 - 8}>${node.phase}</text>
        `;
      });

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

    const phaseTotals: Record<Phase, number> = { L1: 0, L2: 0, L3: 0 };
    for (const node of nodes) {
      if (node.computed.power && node.computed.power > 0) phaseTotals[node.phase] += node.computed.power;
    }

    const activePhases = (Object.values(phaseTotals).filter((v) => v > 0).length || 1) as 1 | 2 | 3;
    const avg = (phaseTotals.L1 + phaseTotals.L2 + phaseTotals.L3) / activePhases;
    const maxDev = Math.max(Math.abs(phaseTotals.L1 - avg), Math.abs(phaseTotals.L2 - avg), Math.abs(phaseTotals.L3 - avg));
    const phaseImbalancePct = avg > 0 ? (maxDev / avg) * 100 : 0;

    const interPanelConnections = nodes
      .filter((node) => node.parent)
      .map((node) => ({ child: node, parent: node.parent ? nodeMap.get(node.parent) : undefined }))
      .filter((entry): entry is { child: PowerNode; parent: PowerNode } => Boolean(entry.parent))
      .filter(({ child, parent }) => Boolean(child.panel_id && parent.panel_id && child.panel_id !== parent.panel_id));

    const panelOrder = new Map(this.config.panels.map((panel, idx) => [panel.id, idx]));
    const panelCanvasWidth = 1200;
    const panelCanvasHeight = Math.max(220, this.config.panels.length * 90);

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

          <div class="graph" style=${`height:${graphHeight}px`}>
            <div class="graph-glow"></div>
            <svg viewBox=${`0 0 ${layout.width} ${graphHeight}`} preserveAspectRatio="none">
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

          ${interPanelConnections.length
            ? html`
                <div class="interpanel">
                  <div class="interpanel-title">Inter-Panel Routing</div>
                  <svg viewBox=${`0 0 ${panelCanvasWidth} ${panelCanvasHeight}`} preserveAspectRatio="none">
                    ${interPanelConnections.map(({ child, parent }) => {
                      const fromIndex = panelOrder.get(parent.panel_id ?? "") ?? 0;
                      const toIndex = panelOrder.get(child.panel_id ?? "") ?? 0;
                      const panelCount = Math.max(1, this.config!.panels.length);
                      const laneW = panelCanvasWidth / panelCount;

                      const x1 = fromIndex * laneW + laneW / 2;
                      const x2 = toIndex * laneW + laneW / 2;
                      const y1 = 36 + ((parent.panel_slot ?? 1) % 8) * 22;
                      const y2 = 36 + ((child.panel_slot ?? 1) % 8) * 22;
                      const midX = (x1 + x2) / 2;
                      const d = `M ${x1} ${y1} L ${midX} ${y1} L ${midX} ${y2} L ${x2} ${y2}`;
                      const pid = `inter-${parent.id}-${child.id}`;
                      const flow = getEdgeFlow(child, this.config!.min_active_power);

                      return svg`
                        <path id=${pid} class=${`inter-edge phase-${this.phaseClass(child.phase)}`} d=${d}></path>
                        <text class="inter-label" x=${x1} y=${18}>${parent.panel_id}</text>
                        <text class="inter-label" x=${x2} y=${18}>${child.panel_id}</text>
                        ${flow.active
                          ? svg`<circle class="flow-dot panel" r="3"><animateMotion dur=${`${flow.speedSeconds}s`} repeatCount="indefinite" rotate="auto"><mpath href=${`#${pid}`}></mpath></animateMotion></circle>`
                          : svg``}
                      `;
                    })}
                  </svg>
                </div>
              `
            : html``}

          ${this.config.panels.length
            ? html`
                <div class="panels">
                  ${this.config.panels.map((panel) => {
                    const panelNodes = nodes.filter((node) => node.panel_id === panel.id);
                    const slotCount = panel.slots;
                    const columns = panel.columns && panel.columns > 0 ? panel.columns : Math.min(slotCount, 4);
                    const occupied = panelNodes.filter((node) => Number.isFinite(node.panel_slot)).length;
                    const usage = Math.min(100, (occupied / slotCount) * 100);
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
                              const flow = getEdgeFlow(node, this.config!.min_active_power);

                              const col = columns;
                              const cellW = 1000 / col;
                              const rows = Math.ceil(slotCount / col);
                              const cellH = 260 / Math.max(rows, 1);

                              const pCol = (parentSlot - 1) % col;
                              const pRow = Math.floor((parentSlot - 1) / col);
                              const cCol = (childSlot - 1) % col;
                              const cRow = Math.floor((childSlot - 1) / col);

                              // terminal anchors at slot borders
                              const x1 = pCol * cellW + cellW * 0.86;
                              const y1 = pRow * cellH + cellH / 2;
                              const x2 = cCol * cellW + cellW * 0.14;
                              const y2 = cRow * cellH + cellH / 2;
                              const midX = (x1 + x2) / 2;
                              const d = `M ${x1} ${y1} L ${midX} ${y1} L ${midX} ${y2} L ${x2} ${y2}`;
                              const pid = `panel-edge-${panel.id}-${node.id}`;

                              return svg`
                                <path id=${pid} class=${`panel-edge ${flow.active ? "active" : ""} phase-${this.phaseClass(node.phase)}`} d=${d}></path>
                                <circle cx=${x1} cy=${y1} r="2" class="terminal-dot"></circle>
                                <circle cx=${x2} cy=${y2} r="2" class="terminal-dot"></circle>
                                ${flow.active
                                  ? svg`
                                      <circle class="flow-dot panel" r="3"><animateMotion dur=${`${flow.speedSeconds}s`} repeatCount="indefinite" rotate="auto"><mpath href=${`#${pid}`}></mpath></animateMotion></circle>
                                      ${flow.bidirectional
                                        ? svg`<circle class="flow-dot panel reverse" r="3"><animateMotion dur=${`${flow.speedSeconds}s`} repeatCount="indefinite" rotate="auto-reverse"><mpath href=${`#${pid}`}></mpath></animateMotion></circle>`
                                        : svg``}
                                    `
                                  : svg``}
                              `;
                            })}
                          </svg>

                          <div class="panel-grid" style=${`grid-template-columns: repeat(${columns}, minmax(140px, 1fr));`}>
                            ${Array.from({ length: slotCount }, (_, index) => {
                              const slot = index + 1;
                              const slotNode = slotNodeMap.get(slot);

                              if (!slotNode) {
                                return html`<div class="panel-slot empty dropzone" @dragover=${this.onDragOver} @drop=${() => this.onDrop(panel.id, slot)}><div class="slot-label">Slot ${slot}</div><div class="slot-empty">empty</div></div>`;
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
              `
            : html``}

          ${this.editMode
            ? html`
                <div class="yaml-preview">
                  <div class="yaml-title">Configurator YAML Preview</div>
                  <pre>${this.generateYamlPreview()}</pre>
                </div>
              `
            : html``}
        </div>
      </ha-card>
    `;
  }
}
