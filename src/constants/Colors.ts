/**
 * Color scheme with dark theme and yellow highlights
 */

const tintColorLight = '#FFD700'; // Gold/Yellow
const tintColorDark = '#FFD700'; // Gold/Yellow

export default {
  light: {
    text: '#11181C',
    background: '#fff',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#ECEDEE',
    background: '#1A1A1A', // Dark background
    tint: tintColorDark, // Yellow highlights
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark, // Yellow for selected tabs
  },
};

