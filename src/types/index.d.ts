// DC Style TypeScript 类型定义

/**
 * DC Style 主命名空间
 */
declare namespace DCStyle {
  /**
   * 颜色主题类型
   */
  type Theme = 'light' | 'dark' | 'blue' | 'red' | 'green' | 'yellow' | 'purple' | 'indigo' | 'orange' | 'grey' | 'colorful';

  /**
   * 尺寸类型
   */
  type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl';

  /**
   * 间距类型
   */
  type Spacing = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '8' | '10' | '12' | '16' | '20' | '24' | '32' | '40' | '48' | '56' | '64';

  /**
   * 断点类型
   */
  type Breakpoint = 'sm' | 'md' | 'lg' | 'xl' | '2xl';

  /**
   * 工具类类型
   */
  interface UtilityClass {
    name: string;
    description: string;
    category: string;
    example: string;
  }

  /**
   * 主题配置
   */
  interface ThemeConfig {
    name: Theme;
    colors: {
      primary: string;
      secondary: string;
      accent: string;
      background: string;
      foreground: string;
      success: string;
      warning: string;
      error: string;
      info: string;
    };
  }

  /**
   * 全局配置
   */
  interface Config {
    theme: Theme;
    prefix: string;
    darkMode: 'class' | 'media';
    important: boolean;
  }
}

/**
 * DC Style 全局变量
 */
declare const DCStyle: {
  version: string;
  config: DCStyle.Config;
  themes: DCStyle.Theme[];
  utilities: DCStyle.UtilityClass[];
  setTheme: (theme: DCStyle.Theme) => void;
  getTheme: () => DCStyle.Theme;
};

export as namespace DCStyle;
export = DCStyle;
