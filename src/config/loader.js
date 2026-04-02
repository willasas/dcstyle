/**
 * DC Style Configuration Loader
 * 加载和应用DC Style配置文件
 */

const fs = require('fs');
const path = require('path');

class ConfigLoader {
  constructor() {
    this.config = null;
    this.defaultConfig = this.getDefaultConfig();
  }

  /**
   * 获取默认配置
   */
  getDefaultConfig() {
    return {
      theme: {
        colors: {
          primary: '#3b82f6',
          secondary: '#64748b',
          success: '#10b981',
          warning: '#f59e0b',
          danger: '#ef4444',
          info: '#06b6d4',
          light: '#f8fafc',
          dark: '#1e293b',
          custom: {
            primary: '#3b82f6',
            secondary: '#64748b',
            accent: '#8b5cf6'
          }
        },
        fontFamily: {
          sans: ['HarmonyOS Sans', 'IBM Plex Sans', 'NotoSans', 'sans-serif'],
          serif: ['Georgia', 'Cambria', 'serif'],
          mono: ['JetBrainsMono', 'monospace']
        },
        fontSize: {
          xs: '0.75rem',
          sm: '0.875rem',
          base: '1rem',
          lg: '1.125rem',
          xl: '1.25rem',
          '2xl': '1.5rem',
          '3xl': '1.875rem',
          '4xl': '2.25rem',
          '5xl': '3rem',
          '6xl': '4rem'
        },
        spacing: {
          0: '0',
          1: '0.25rem',
          2: '0.5rem',
          3: '0.75rem',
          4: '1rem',
          5: '1.25rem',
          6: '1.5rem',
          8: '2rem',
          10: '2.5rem',
          12: '3rem',
          16: '4rem',
          20: '5rem',
          24: '6rem',
          32: '8rem',
          40: '10rem',
          48: '12rem',
          56: '14rem',
          64: '16rem'
        },
        borderRadius: {
          none: '0',
          sm: '0.125rem',
          DEFAULT: '0.25rem',
          md: '0.375rem',
          lg: '0.5rem',
          xl: '0.75rem',
          '2xl': '1rem',
          '3xl': '1.5rem',
          full: '9999px'
        },
        boxShadow: {
          sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
          DEFAULT: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
          md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
          lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
          xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
          '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
          inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.06)'
        }
      },
      utilities: {
        responsive: true,
        hover: true,
        focus: true,
        active: true,
        darkMode: false
      },
      prefix: '',
      content: [
        './src/**/*.{html,js,jsx,ts,tsx,vue}',
        './public/**/*.html'
      ],
      plugins: [],
      custom: {
        designWidth: 1920,
        cssVariables: true,
        customProperties: true,
        compress: false
      }
    };
  }

  /**
   * 加载配置文件
   * @param {string} configPath - 配置文件路径
   * @returns {object} 合并后的配置
   */
  load(configPath = null) {
    let userConfig = {};
    
    // 尝试加载用户配置文件
    if (configPath && fs.existsSync(configPath)) {
      try {
        userConfig = require(configPath);
        console.log('✅ DC Style配置文件加载成功:', configPath);
      } catch (error) {
        console.warn('⚠️ DC Style配置文件加载失败，使用默认配置:', error.message);
        userConfig = {};
      }
    } else {
      // 尝试从项目根目录加载dc.config.js
      const defaultConfigPath = path.join(process.cwd(), 'dc.config.js');
      if (fs.existsSync(defaultConfigPath)) {
        try {
          userConfig = require(defaultConfigPath);
          console.log('✅ DC Style配置文件加载成功:', defaultConfigPath);
        } catch (error) {
          console.warn('⚠️ DC Style配置文件加载失败，使用默认配置:', error.message);
        }
      } else {
        console.log('ℹ️ 未找到DC Style配置文件，使用默认配置');
      }
    }

    // 合并配置
    this.config = this.mergeConfigs(this.defaultConfig, userConfig);
    return this.config;
  }

  /**
   * 合并配置对象
   * @param {object} defaultConfig - 默认配置
   * @param {object} userConfig - 用户配置
   * @returns {object} 合并后的配置
   */
  mergeConfigs(defaultConfig, userConfig) {
    const merged = { ...defaultConfig };
    
    for (const key in userConfig) {
      if (userConfig.hasOwnProperty(key)) {
        if (typeof userConfig[key] === 'object' && userConfig[key] !== null && !Array.isArray(userConfig[key])) {
          if (typeof merged[key] === 'object' && merged[key] !== null) {
            merged[key] = this.mergeConfigs(merged[key], userConfig[key]);
          } else {
            merged[key] = userConfig[key];
          }
        } else {
          merged[key] = userConfig[key];
        }
      }
    }
    
    return merged;
  }

  /**
   * 获取配置
   * @returns {object} 配置对象
   */
  getConfig() {
    if (!this.config) {
      this.load();
    }
    return this.config;
  }

  /**
   * 获取主题配置
   * @returns {object} 主题配置
   */
  getTheme() {
    return this.getConfig().theme;
  }

  /**
   * 获取工具类配置
   * @returns {object} 工具类配置
   */
  getUtilities() {
    return this.getConfig().utilities;
  }

  /**
   * 获取自定义配置
   * @returns {object} 自定义配置
   */
  getCustom() {
    return this.getConfig().custom;
  }

  /**
   * 生成CSS变量
   * @returns {string} CSS变量字符串
   */
  generateCSSVariables() {
    const theme = this.getTheme();
    let cssVariables = ':root {\n';

    // 生成颜色变量
    if (theme.colors) {
      for (const [name, value] of Object.entries(theme.colors)) {
        if (typeof value === 'string') {
          cssVariables += `  --color-${name}: ${value};\n`;
        } else if (typeof value === 'object') {
          for (const [subName, subValue] of Object.entries(value)) {
            cssVariables += `  --color-${name}-${subName}: ${subValue};\n`;
          }
        }
      }
    }

    // 生成字体变量
    if (theme.fontFamily) {
      for (const [name, value] of Object.entries(theme.fontFamily)) {
        cssVariables += `  --font-family-${name}: ${Array.isArray(value) ? value.join(', ') : value};\n`;
      }
    }

    // 生成字体大小变量
    if (theme.fontSize) {
      for (const [name, value] of Object.entries(theme.fontSize)) {
        cssVariables += `  --font-size-${name}: ${value};\n`;
      }
    }

    // 生成间距变量
    if (theme.spacing) {
      for (const [name, value] of Object.entries(theme.spacing)) {
        cssVariables += `  --spacing-${name}: ${value};\n`;
      }
    }

    // 生成边框圆角变量
    if (theme.borderRadius) {
      for (const [name, value] of Object.entries(theme.borderRadius)) {
        cssVariables += `  --border-radius-${name}: ${value};\n`;
      }
    }

    cssVariables += '}\n';
    return cssVariables;
  }
}

// 导出单例实例
const configLoader = new ConfigLoader();
module.exports = configLoader;
