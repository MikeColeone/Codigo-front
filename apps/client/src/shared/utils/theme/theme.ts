/**
 * 检查当前主题是否为深色主题。
 * @returns boolean类型 返回是否是深色主题
 */
export const isDark = () => {
  if (typeof window === "undefined") {
    return false;
  }
  return window.matchMedia?.("(prefers-color-scheme: dark)")?.matches ?? false;
};

/**
 * 枚举主题类型
 * @description 主题类型包括浅色主题和深色主题
 */
export enum ThemeName {
  light = "light",
  dark = "dark",
}

/**
 * 枚举主题类型组
 */
export enum ThemeNameGroup {
  light = "light",
  dark = "dark",
  auto = "auto",
}

/**
 * 主题配置类型
 * @typedef {Object} Theme
 * @property {ThemeName} name - 主题名称
 * @property {string} providerName - 主题提供器名称
 */
export type Theme = {
  name: ThemeName;
  providerName: string;
};

/**
 * 浅色主题配置
 */
export const lightTheme: Theme = {
  name: ThemeName.light,
  providerName: "theme-light",
};

/**
 * 深色主题配置
 */
export const darkTheme: Theme = {
  name: ThemeName.dark,
  providerName: "theme-dark",
};

/**
 * 主题类型组映射类型
 * @typedef {Object} ThemeGroupMap
 * @property {ThemeNameGroup} light - 浅色主题组
 * @property {ThemeNameGroup} dark - 深色主题组
 * @property {ThemeNameGroup} auto - 自动主题组
 */
export type ThemeGroupMap = Record<
  ThemeNameGroup,
  { light: Theme; dark: Theme }
>;

/**
 * 主题类型组映射
 */
export const themeGroupMap: ThemeGroupMap = {
  auto: {
    light: lightTheme,
    dark: darkTheme,
  },
  light: {
    light: lightTheme,
    dark: lightTheme,
  },
  dark: {
    light: darkTheme,
    dark: darkTheme,
  },
};
