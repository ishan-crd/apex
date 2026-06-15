/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        accent: '#00E0A4',
        'accent-2': '#00C2C8',
        'accent-ink': '#04130E',
        soft: 'rgba(0,224,164,0.14)',
        bg: '#070809',
        screen: '#0B0C0F',
        surface: '#15171B',
        'surface-2': '#1E2025',
        'surface-3': '#292C32',
        dim: 'rgba(255,255,255,0.62)',
        faint: 'rgba(255,255,255,0.40)',
        ghost: 'rgba(255,255,255,0.14)',
        border: 'rgba(255,255,255,0.09)',
        'border-2': 'rgba(255,255,255,0.15)',
        track: 'rgba(255,255,255,0.10)',
      },
      fontFamily: {
        grotesk: ['SpaceGrotesk_400Regular', 'system-ui'],
        'grotesk-500': ['SpaceGrotesk_500Medium', 'system-ui'],
        'grotesk-600': ['SpaceGrotesk_600SemiBold', 'system-ui'],
        'grotesk-700': ['SpaceGrotesk_700Bold', 'system-ui'],
      },
    },
  },
  plugins: [],
};
