/**
 * DC Style Framework Configuration
 * 用户可以通过修改此文件来自定义DC Style框架的行为
 */

module.exports = {
  // 主题配置
  theme: {
    // 颜色配置
    colors: {
      primary: '#3b82f6',
      secondary: '#64748b',
      success: '#10b981',
      warning: '#f59e0b',
      danger: '#ef4444',
      info: '#06b6d4',
      light: '#f8fafc',
      dark: '#1e293b',
      
      // 自定义颜色
      custom: {
        primary: '#3b82f6',
        secondary: '#64748b',
        accent: '#8b5cf6'
      }
    },

    // 字体配置
    fontFamily: {
      sans: ['HarmonyOS Sans', 'IBM Plex Sans', 'NotoSans', 'sans-serif'],
      serif: ['Georgia', 'Cambria', 'serif'],
      mono: ['JetBrainsMono', 'monospace']
    },

    // 字体大小
    fontSize: {
      xs: '0.75rem',    // 12px
      sm: '0.875rem',   // 14px
      base: '1rem',     // 16px
      lg: '1.125rem',   // 18px
      xl: '1.25rem',    // 20px
      '2xl': '1.5rem',  // 24px
      '3xl': '1.875rem', // 30px
      '4xl': '2.25rem', // 36px
      '5xl': '3rem',    // 48px
      '6xl': '4rem'     // 64px
    },

    // 间距配置
    spacing: {
      0: '0',
      1: '0.25rem',   // 4px
      2: '0.5rem',    // 8px
      3: '0.75rem',   // 12px
      4: '1rem',      // 16px
      5: '1.25rem',   // 20px
      6: '1.5rem',    // 24px
      8: '2rem',      // 32px
      10: '2.5rem',   // 40px
      12: '3rem',     // 48px
      16: '4rem',     // 64px
      20: '5rem',     // 80px
      24: '6rem',     // 96px
      32: '8rem',     // 128px
      40: '10rem',    // 160px
      48: '12rem',    // 192px
      56: '14rem',    // 224px
      64: '16rem'     // 256px
    },

    // 边框圆角
    borderRadius: {
      none: '0',
      sm: '0.125rem',  // 2px
      DEFAULT: '0.25rem', // 4px
      md: '0.375rem',  // 6px
      lg: '0.5rem',    // 8px
      xl: '0.75rem',   // 12px
      '2xl': '1rem',   // 16px
      '3xl': '1.5rem', // 24px
      full: '9999px'
    },

    // 阴影
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

  // 工具类配置
  utilities: {
    // 是否启用响应式工具类
    responsive: true,
    
    // 是否启用悬停效果
    hover: true,
    
    // 是否启用焦点效果
    focus: true,
    
    // 是否启用活跃状态
    active: true,
    
    // 是否启用暗黑模式
    darkMode: false
  },

  // 前缀配置
  prefix: '',

  // 内容路径（用于扫描文件生成工具类）
  content: [
    './src/**/*.{html,js,jsx,ts,tsx,vue}',
    './public/**/*.html'
  ],

  // 插件配置
  plugins: [],

  // 自定义配置
  custom: {
    // 设计稿宽度（用于响应式计算）
    designWidth: 1920,
    
    // 是否启用CSS变量
    cssVariables: true,
    
    // 是否启用自定义属性
    customProperties: true,
    
    // 是否压缩输出
    compress: false
  }
};
