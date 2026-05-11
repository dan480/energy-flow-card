import "./house-power-flow-card";

declare global {
  interface Window {
    customCards?: Array<{ type: string; name: string; description: string }>;
  }
}

window.customCards = window.customCards ?? [];

if (!window.customCards.find((card) => card.type === "house-power-flow-card")) {
  window.customCards.push({
    type: "house-power-flow-card",
    name: "House Power Flow Card",
    description: "Build your home electrical topology and show live power flow.",
  });
}
