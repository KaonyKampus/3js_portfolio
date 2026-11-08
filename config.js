export const CAMERA_Z = 8.5;

export const STAR_COUNT = 65000;

export const PALETTES = {
    ice: { body: '#e2e8f0', dark: '#6366f1', light: '#ffffff', glow: '#38bdf8', accent: '#f472b6', glass: '#7dd3fc' },
    sunset: { body: '#f5d0fe', dark: '#c026d3', light: '#ffffff', glow: '#f472b6', accent: '#38bdf8', glass: '#fbcfe8' },
    gold: { body: '#fde68a', dark: '#d97706', light: '#fffbeb', glow: '#38bdf8', accent: '#a855f7', glass: '#bae6fd' }, mint: { body: '#a7f3d0', dark: '#0d9488', light: '#f0fdfa', glow: '#e879f9', accent: '#fb7185', glass: '#99f6e4' }
};
export const ACTIVE_PALETTE = 'ice';

export const EMISSIVE_STRENGTH = { glow: 1, accent: 0.55, glass: 0.45 };

export const MODEL_SCALE = 2.1;
export const MODEL_SPACING = 7.5;

export const SWAY_BUST = 0.9;
export const SWAY_LAPTOP = 0.5;

// ── Responsive layout of the three figures ──
// When the screen is taller than this width/height ratio (phones, tablets in portrait)
// the figures are not side by side any more: each one gets its own screen and you scroll down to the next.
export const STACK_BREAKPOINT = 1.05;
export const STACK_FILL = 0.92;        // how much of the screen width a figure may fill (1 = edge to edge)
export const STACK_GAP = 1.3;          // distance between figures, in screen heights (above 1 = the next figure is fully out of sight)
export const STACK_HEIGHT = 0.56;      // how much of the screen height a figure may fill
export const STACK_LIFT = 0.07;        // raises the figures on their screen (fraction of the screen height) so the caption below stays clear