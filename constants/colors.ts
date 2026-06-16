export const darkColors = {
  accent:    '#00E0A4',
  accent2:   '#00C2C8',
  accentInk: '#04130E',
  soft:      'rgba(0,224,164,0.14)',
  bg:        '#070809',
  screen:    '#0B0C0F',
  surface:   '#15171B',
  surface2:  '#1E2025',
  surface3:  '#292C32',
  text:      '#FFFFFF',
  dim:       'rgba(255,255,255,0.62)',
  faint:     'rgba(255,255,255,0.40)',
  ghost:     'rgba(255,255,255,0.14)',
  border:    'rgba(255,255,255,0.09)',
  border2:   'rgba(255,255,255,0.15)',
  track:     'rgba(255,255,255,0.10)',
};

export const lightColors = {
  accent:    '#00B286',
  accent2:   '#039AA6',
  accentInk: '#042018',
  soft:      'rgba(0,178,134,0.12)',
  bg:        '#E6E8E5',
  screen:    '#F4F5F3',
  surface:   '#FFFFFF',
  surface2:  '#F0F1EF',
  surface3:  '#E6E8E4',
  text:      '#0A0B0D',
  dim:       'rgba(12,14,16,0.60)',
  faint:     'rgba(12,14,16,0.42)',
  ghost:     'rgba(12,14,16,0.12)',
  border:    'rgba(12,14,16,0.08)',
  border2:   'rgba(12,14,16,0.12)',
  track:     'rgba(12,14,16,0.08)',
};

export type Colors = typeof darkColors;

// Static dark fallback — for components not yet using useColors()
export const C = darkColors;
