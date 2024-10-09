import * as carbonTheme from "@daesite/colors/dist/carbon.theme.css?inline";
import * as snowTheme from "@daesite/colors/dist/snow.theme.css?inline";

import {decodeBase64URL, encodeBase64URL} from "../helpers";

export enum ThemeTypes {
  Carbon,
  Snow,
}

export const DEFAULT_THEME = ThemeTypes.Carbon;

export const THEMES_MAP = {
  [ThemeTypes.Carbon]: {
    label: "Carbon",
    identifier: ThemeTypes.Carbon,
    theme: carbonTheme,
  },
  [ThemeTypes.Snow]: {
    label: "Snow",
    identifier: ThemeTypes.Snow,
    theme: snowTheme,
  },
};

export const getDarkThemes = () => [ThemeTypes.Carbon];

export const getThemes = () => {
  return [ThemeTypes.Carbon, ThemeTypes.Snow].map((id) => THEMES_MAP[id]);
};

export enum ThemeModeSetting {
  Auto,
  Dark,
  Light,
}

export enum ColorScheme {
  Dark,
  Light,
}

export enum ThemeFontSizeSetting {
  DEFAULT = 0,
  X_SMALL,
  SMALL,
  LARGE,
  X_LARGE,
}

export enum ThemeFeatureSetting {
  DEFAULT,
  SCROLLBARS_OFF,
  ANIMATIONS_OFF,
}

export interface ThemeSetting {
  Mode: ThemeModeSetting;
  LightTheme: ThemeTypes;
  DarkTheme: ThemeTypes;
  FontSize: ThemeFontSizeSetting;
  Features: ThemeFeatureSetting;
}

export const getDefaultThemeSetting = (
  themeType?: ThemeTypes,
): ThemeSetting => {
  return {
    Mode: ThemeModeSetting.Light,
    LightTheme: themeType || DEFAULT_THEME,
    DarkTheme: ThemeTypes.Carbon,
    FontSize: ThemeFontSizeSetting.DEFAULT,
    Features: ThemeFeatureSetting.DEFAULT,
  };
};

const getValidatedThemeType = (themeType: number): ThemeTypes | undefined => {
  if (themeType >= ThemeTypes.Carbon && themeType <= ThemeTypes.Snow) {
    return themeType;
  }
};

const getParsedThemeType = (maybeThemeType: any): ThemeTypes | undefined => {
  return getValidatedThemeType(Number(maybeThemeType));
};

const getValidatedThemeMode = (
  maybeThemeMode: number | undefined,
): ThemeModeSetting | undefined => {
  if (
    maybeThemeMode !== undefined &&
    maybeThemeMode >= ThemeModeSetting.Auto &&
    maybeThemeMode <= ThemeModeSetting.Light
  ) {
    return maybeThemeMode;
  }
};

const getValidatedFontSize = (maybeFontSize: number | undefined) => {
  if (
    maybeFontSize !== undefined &&
    maybeFontSize >= ThemeFontSizeSetting.DEFAULT &&
    maybeFontSize <= ThemeFontSizeSetting.X_LARGE
  ) {
    return maybeFontSize;
  }
};

const getValidatedFeatures = (maybeFeatures: number | undefined) => {
  if (
    maybeFeatures !== undefined &&
    maybeFeatures >= 0 &&
    maybeFeatures <= 32
  ) {
    return maybeFeatures;
  }
};

export const getParsedThemeSetting = (
  storedThemeSetting: string | undefined,
): ThemeSetting => {
  // The theme cookie used to contain just the theme number type.
  if (storedThemeSetting && storedThemeSetting?.length === 1) {
    const maybeParsedThemeType = getParsedThemeType(storedThemeSetting);
    if (maybeParsedThemeType !== undefined) {
      return getDefaultThemeSetting(maybeParsedThemeType);
    }
  }
  const defaultThemeSetting = getDefaultThemeSetting(DEFAULT_THEME);
  // Now it contains JSON
  if (storedThemeSetting && storedThemeSetting?.length >= 10) {
    try {
      const parsedTheme: any = JSON.parse(decodeBase64URL(storedThemeSetting));
      return {
        Mode:
          getValidatedThemeMode(parsedTheme.Mode) ?? defaultThemeSetting.Mode,
        LightTheme:
          getValidatedThemeType(parsedTheme.LightTheme) ??
          defaultThemeSetting.LightTheme,
        DarkTheme:
          getValidatedThemeType(parsedTheme.DarkTheme) ??
          defaultThemeSetting.DarkTheme,
        FontSize:
          getValidatedFontSize(parsedTheme.FontSize) ??
          defaultThemeSetting.FontSize,
        Features:
          getValidatedFeatures(parsedTheme.Features) ??
          defaultThemeSetting.Features,
      };
    } catch {}
  }
  return defaultThemeSetting;
};

const getDiff = (a: ThemeSetting, b: ThemeSetting): Partial<ThemeSetting> => {
  return Object.entries(a).reduce<Partial<ThemeSetting>>(
    (acc, [_key, value]) => {
      const key = _key as keyof ThemeSetting;
      const otherValue = b[key] as any;
      if (value !== otherValue) {
        acc[key] = otherValue;
      }
      return acc;
    },
    {},
  );
};

export const serializeThemeSetting = (themeSetting: ThemeSetting) => {
  const diff = getDiff(getDefaultThemeSetting(), themeSetting);
  const keys = Object.keys(diff) as (keyof ThemeSetting)[];
  if (!keys.length) {
    return;
  }
  if (keys.length === 1 && keys[0] === "LightTheme") {
    return `${diff.LightTheme}`;
  }
  return encodeBase64URL(JSON.stringify(diff));
};

export const getThemeType = (
  theme: ThemeSetting,
  colorScheme: ColorScheme,
): ThemeTypes => {
  let value: ThemeTypes;

  switch (theme.Mode) {
    case ThemeModeSetting.Auto:
      value =
        colorScheme === ColorScheme.Dark ? theme.DarkTheme : theme.LightTheme;
      break;
    case ThemeModeSetting.Dark:
      value = theme.DarkTheme;
      break;
    case ThemeModeSetting.Light:
      value = theme.LightTheme;
      break;
    default:
      value = theme.DarkTheme;
      break;
  }

  return getValidatedThemeType(value) ?? DEFAULT_THEME;
};
