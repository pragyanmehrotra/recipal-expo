import { createTamagui } from "tamagui";
import { createInterFont } from "@tamagui/font-inter";
import { shorthands } from "@tamagui/shorthands";
import { themes, tokens } from "@tamagui/themes";
import { createMedia } from "@tamagui/react-native-media-driver";

const headingFont = createInterFont();
const bodyFont = createInterFont();

const config = createTamagui({
  defaultFont: "body",
  fonts: {
    heading: headingFont,
    body: bodyFont,
  },
  themes: {
    ...themes,
    dark: {
      background: "#1a1a1a",
      backgroundHover: "#2a2a2a",
      backgroundPress: "#3a3a3a",
      backgroundFocus: "#2a2a2a",
      borderColor: "#404040",
      color: "#ffffff",
      colorHover: "#f0f0f0",
      colorPress: "#e0e0e0",
      colorFocus: "#f0f0f0",
      placeholderColor: "#888888",
      color1: "#1a1a1a",
      color2: "#2a2a2a",
      color3: "#3a3a3a",
      color4: "#404040",
      color5: "#505050",
      color6: "#606060",
      color7: "#707070",
      color8: "#808080",
      color9: "#909090",
      color10: "#a0a0a0",
      color11: "#b0b0b0",
      color12: "#ffffff",
    },
  },
  tokens: {
    ...tokens,
    color: {
      ...tokens.color,
      primary: "#FF6B6B",
      secondary: "#4ECDC4",
      accent: "#FFA726",
      success: "#4CAF50",
      warning: "#FF9800",
      error: "#F44336",
    },
    space: {
      ...tokens.space,
      0: 0,
      1: 4,
      2: 8,
      3: 12,
      4: 16,
      5: 20,
      6: 24,
      7: 28,
      8: 32,
      9: 36,
      10: 40,
    },
    size: {
      ...tokens.size,
      0: 0,
      1: 4,
      2: 8,
      3: 12,
      4: 16,
      5: 20,
      6: 24,
      7: 28,
      8: 32,
      9: 36,
      10: 40,
    },
    radius: {
      ...tokens.radius,
      0: 0,
      1: 4,
      2: 8,
      3: 12,
      4: 16,
      5: 20,
    },
  },
  shorthands,
  media: createMedia({
    xs: { maxWidth: 660 },
    sm: { maxWidth: 800 },
    md: { maxWidth: 1020 },
    lg: { maxWidth: 1280 },
    xl: { maxWidth: 1420 },
    xxl: { maxWidth: 1600 },
    gtXs: { minWidth: 660 + 1 },
    gtSm: { minWidth: 800 + 1 },
    gtMd: { minWidth: 1020 + 1 },
    gtLg: { minWidth: 1280 + 1 },
    short: { maxHeight: 820 },
    tall: { minHeight: 820 },
    hoverNone: { hover: "none" },
    pointerCoarse: { pointer: "coarse" },
  }),
});

export default config;
