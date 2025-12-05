/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

export const Colors = {
  light: {
    // primary text color
    primaryText: '#1D0F48',
    text: '#000000',
    background: '#D9D9D9',
    eggshellWhite: '#FFFDFA',
    primary: '#90D0CD',
    primaryPressed: '#628fa4ff',
    formInputBackground: '#F3F2F2',
    buttonBackground: '#C5C3C3',
    imagePlaceholder: '#FFF',
    selectedSlotBackground: '#000000',
    selectedSlotText: '#F3F2F2',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
    orderButton: '#90D0CD',
    redeemedButton: '#AFE5E2',
    redeemedButtonText: '#626262',
    errorText: '#F32727',
    disabledButton: '#D3D3D3',
    orderBackground: '#EAE8E8',
    insufficientFunds: '#F32727',
    inputBorder: '#D1D5DB',
    transparent: 'transparent',
    fishBlue: `#34A5E4`,
    white: `white`,
    // Bottom nav styling to match item screen tiles
    bottomNav: '#EAE8E8',
    navIconBackground: '#FFFFFF',
    navIconBorder: '#000000',
    // Profile specific colors
    cardBackground: '#9D9D9D',
    cardBorder: '#000000',
    fishTankWater: '#D9D9D9',
    fishTankBase: '#9D9D9D',
    progressBarBackground: '#9D9D9D',
    progressBarFill: '#375361',
    textSecondary: '#666464',
    // Filter and drawer colors
    filterBlue: '#3B82F6',
    filterBorder: '#E5E7EB',
    filterActiveBackground: '#EFF6FF',
    filterText: '#4B5563',
    toggleActiveBackground: '#EDECEC',
    handleIndicatorGray: '#999',
    sliderGray: '#9CA3AF',
    semiTransparentTeal: 'rgba(12, 120, 128, 0.5)',
    overlay: 'rgba(0,0,0,0.5)',
    mapCircleFill: 'rgba(59, 130, 246, 0.1)',
    // order history screen colors
    orderStatusPending: '#F7581F',
    orderStatusClaimed: '#2B5213',
    orderStatusAll: '#34A5E4',
    moreInfoButton: '#FEB83C',
    locationContainerBackground: 'rgba(254, 184, 60, 0.27)', // #FEB83C45
    radiusDisplayBackground: '#FFEED0',
    sliderContainerBackground: '#FFDB9B',
    filterButtonBackground: '#74C0EB',
    searchBarBorder: '#1F2937',
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
  },
};
