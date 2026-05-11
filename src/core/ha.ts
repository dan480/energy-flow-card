import type { HomeAssistant } from "../model/types";

export function entityToNumber(hass: HomeAssistant | undefined, entityId?: string): number | null {
  if (!hass || !entityId) return null;
  const state = hass.states[entityId]?.state;
  if (state === undefined) return null;
  const value = Number(state);
  return Number.isFinite(value) ? value : null;
}

export function entityToText(hass: HomeAssistant | undefined, entityId?: string): string | null {
  if (!hass || !entityId) return null;
  return hass.states[entityId]?.state ?? null;
}
