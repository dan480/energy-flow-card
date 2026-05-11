import { css } from "lit";

export const cardStyles = css`
  :host {
    display: block;
    width: 100%;
  }

  ha-card {
    width: 100%;
  }

  .wrapper {
    padding: 14px;
    border-radius: 14px;
    background:
      radial-gradient(circle at 8% 0%, rgba(56, 189, 248, 0.18), transparent 35%),
      radial-gradient(circle at 90% 0%, rgba(16, 185, 129, 0.16), transparent 35%),
      linear-gradient(180deg, rgba(12, 16, 24, 0.04), rgba(12, 16, 24, 0.01));
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
    font-size: 22px;
    font-weight: 800;
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

  .kpis {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
    gap: 8px;
    min-width: min(980px, 100%);
  }

  .kpi {
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
  }

  .phase-chip.l1 {
    background: rgba(239, 68, 68, 0.12);
    border: 1px solid rgba(239, 68, 68, 0.35);
  }

  .phase-chip.l2 {
    background: rgba(59, 130, 246, 0.12);
    border: 1px solid rgba(59, 130, 246, 0.35);
  }

  .phase-chip.l3 {
    background: rgba(16, 185, 129, 0.12);
    border: 1px solid rgba(16, 185, 129, 0.35);
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
  .panel-edge.phase-l1,
  .inter-edge.phase-l1 {
    stroke: rgba(239, 68, 68, 0.75);
  }

  .edge.phase-l2,
  .panel-edge.phase-l2,
  .inter-edge.phase-l2 {
    stroke: rgba(59, 130, 246, 0.75);
  }

  .edge.phase-l3,
  .panel-edge.phase-l3,
  .inter-edge.phase-l3 {
    stroke: rgba(16, 185, 129, 0.75);
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
    width: 200px;
    min-height: 74px;
    padding: 9px 10px;
    border-radius: 12px;
    border: 1px solid rgba(120, 130, 150, 0.4);
    background: rgba(255, 255, 255, 0.9);
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

  .interpanel {
    border: 1px solid rgba(120, 130, 150, 0.28);
    border-radius: 12px;
    background: rgba(248, 250, 252, 0.88);
    margin-bottom: 12px;
    padding: 8px;
  }

  .interpanel-title {
    font-size: 12px;
    font-weight: 800;
    margin-bottom: 6px;
  }

  .interpanel svg {
    position: relative;
    width: 100%;
    height: 130px;
  }

  .inter-edge {
    fill: none;
    stroke-width: 2.4;
    stroke-dasharray: 7 5;
  }

  .inter-label {
    font-size: 11px;
    fill: rgba(30, 41, 59, 0.85);
    font-weight: 700;
    text-anchor: middle;
  }

  .panels {
    display: grid;
    gap: 12px;
    grid-template-columns: repeat(auto-fit, minmax(520px, 1fr));
  }

  .panel {
    border: 1px solid rgba(120, 130, 150, 0.28);
    border-radius: 14px;
    padding: 10px;
    background: linear-gradient(160deg, rgba(255, 255, 255, 0.9), rgba(244, 248, 255, 0.86));
    box-shadow: 0 8px 20px rgba(15, 23, 42, 0.06);
  }

  .panel-top {
    display: flex;
    justify-content: space-between;
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
    stroke-dasharray: 6 5;
  }

  .panel-edge.active {
    stroke-width: 2.8;
    filter: drop-shadow(0 0 3px rgba(14, 165, 233, 0.7));
  }

  .terminal-dot {
    fill: #334155;
    opacity: 0.9;
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
    background: rgba(255, 255, 255, 0.92);
  }

  .panel-slot.draggable {
    cursor: grab;
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

  @media (max-width: 1020px) {
    .panels {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 740px) {
    .node {
      width: 156px;
      min-height: 68px;
    }

    .kpis {
      grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
      min-width: 100%;
    }
  }
`;
