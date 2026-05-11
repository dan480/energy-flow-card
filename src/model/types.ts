export type Phase = "L1" | "L2" | "L3";

export type NodeType =
  | "grid"
  | "inverter"
  | "battery"
  | "solar"
  | "main_breaker"
  | "breaker"
  | "line"
  | "load"
  | "input"
  | "device"
  | "bus"
  | "relay";

export type LoadKind =
  | "boiler"
  | "pump"
  | "fridge"
  | "tv"
  | "router"
  | "heater"
  | "lighting"
  | "socket"
  | "other";

export interface PanelConfig {
  id: string;
  name: string;
  slots: number;
  columns?: number;
}

export interface PowerNodeConfig {
  id: string;
  parent?: string;
  name?: string;
  type?: NodeType;
  load_kind?: LoadKind;
  rated_power?: number;
  phase?: Phase;
  power?: string;
  current?: string;
  voltage?: string;
  state?: string;
  panel_id?: string;
  panel_slot?: number;
  bidirectional_with_parent?: boolean;
}

export interface CardConfig {
  type: "custom:house-power-flow-card";
  title?: string;
  root_id?: string;
  min_active_power?: number;
  line_width?: number;
  max_expected_power?: number;
  nodes: PowerNodeConfig[];
  panels?: PanelConfig[];
}

export interface HassEntity {
  state: string;
}

export interface HomeAssistant {
  states: Record<string, HassEntity | undefined>;
}

export interface LiveMetrics {
  power: number | null;
  current: number | null;
  voltage: number | null;
  state: string | null;
}

export interface ComputedMetrics {
  power: number | null;
  current: number | null;
}

export interface PowerNode extends PowerNodeConfig {
  name: string;
  type: NodeType;
  load_kind: LoadKind;
  phase: Phase;
  rated_power: number | null;
  bidirectional_with_parent: boolean;
  live: LiveMetrics;
  computed: ComputedMetrics;
}

export interface NodePosition {
  x: number;
  y: number;
}

export interface GraphLayout {
  width: number;
  height: number;
  positions: Map<string, NodePosition>;
}

export interface EdgeFlow {
  active: boolean;
  reverse: boolean;
  speedSeconds: number;
  bidirectional: boolean;
}
