# DC Style

一个功能丰富的CSS框架，提供多种主题和实用工具类，适用于现代Web开发，类似Tailwind CSS。

## 特性

- 🎨 **多主题支持** - 内置11种主题（暗黑、明亮、灰色、红色、橙色、黄色、绿色、靛蓝、蓝色、紫色、多彩）
- 📱 **响应式设计** - 完整的响应式工具类系统
- 🛠️ **实用工具类** - 丰富的CSS工具类，类似TailwindCSS
- 🎯 **现代化架构** - 基于SCSS构建，支持CSS变量
- 🚀 **轻量高效** - 优化的构建输出，支持按需引入
- 🎪 **动画效果** - 内置多种动画和过渡效果
- 🌐 **多格式支持** - 支持npm安装、CDN引入和UMD格式
- 🖥️ **VS Code集成** - 智能提示插件，提升开发体验
- 📦 **模块化设计** - 支持按需引入和自定义构建

## 安装

### npm
```bash
npm install dcstyle
```

### pnpm
```bash
pnpm add dcstyle
```

### yarn
```bash
yarn add dcstyle
```

### CDN
```html
<!-- 开发版本 -->
<link rel="stylesheet" href="https://unpkg.com/dcstyle@1.0.0/dist/dc.css">

<!-- 生产版本（压缩） -->
<link rel="stylesheet" href="https://unpkg.com/dcstyle@1.0.0/dist/dc.min.css">

<!-- UMD格式（通过脚本引入） -->
<script src="https://unpkg.com/dcstyle@1.0.0/dist/dc.umd.js"></script>
```

## 快速开始

### 在HTML中直接使用
```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="node_modules/dcstyle/dist/dc.css">
    <title>DC Style Demo</title>
</head>
<body data-theme="light-theme">
    <div class="container">
        <h1 class="text-center text-primary">Hello DC Style!</h1>
        <button class="btn btn-primary">Primary Button</button>
    </div>
</body>
</html>
```

### 使用UMD格式
```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>DC Style UMD Demo</title>
</head>
<body data-theme="light-theme">
    <div class="container">
        <h1 class="text-center text-primary">Hello DC Style!</h1>
        <button class="btn btn-primary">Primary Button</button>
    </div>
    <script src="node_modules/dcstyle/dist/dc.umd.js"></script>
    <script>
        // 访问全局变量
        console.log('DC Style version:', DCStyle.version);
        // 切换主题
        // DCStyle.setTheme('dark');
    </script>
</body>
</html>
```

### 在SCSS项目中引入
```scss
// 引入完整的样式库
@import 'dcstyle/src/css/dc.scss';

// 或者按需引入SCSS文件
@import 'dcstyle/src/css/_layout.scss';
@import 'dcstyle/src/css/_typography.scss';
@import 'dcstyle/src/css/_colors.scss';
```

### 在JavaScript项目中引入
```javascript
// 在Webpack、Vite等构建工具中
import 'dcstyle/dist/dc.css';

// 或者使用CSS Modules
import styles from 'dcstyle/dist/dc.css';
```

## 主题系统

框架支持动态主题切换，通过设置`data-theme`属性即可切换主题：

```html
<!-- 暗黑主题 -->
<body data-theme="dark-theme">

<!-- 明亮主题 -->
<body data-theme="light-theme">

<!-- 灰色主题 -->
<body data-theme="grey-theme">

<!-- 红色主题 -->
<body data-theme="red-theme">

<!-- 橙色主题 -->
<body data-theme="orange-theme">

<!-- 黄色主题 -->
<body data-theme="yellow-theme">

<!-- 绿色主题 -->
<body data-theme="green-theme">

<!-- 靛蓝主题 -->
<body data-theme="indigo-theme">

<!-- 蓝色主题 -->
<body data-theme="blue-theme">

<!-- 紫色主题 -->
<body data-theme="purple-theme">

<!-- 多彩主题 -->
<body data-theme="colorful-theme">
```

## 实用工具类

### 布局类
```html
<div class="flex justify-center items-center">
    <div class="w-1/2 p-4">居中对齐</div>
</div>
```

### 间距类
```html
<div class="m-4 p-4">
    <p class="mb-2">带间距的文本</p>
    <button class="mt-4">按钮</button>
</div>
```

### 颜色类
```html
<p class="text-primary">主要文本</p>
<p class="bg-secondary">次要背景</p>
<button class="btn btn-success">成功按钮</button>
```

### 响应式类
```html
<div class="w-full md:w-1/2 lg:w-1/3">
    响应式宽度
</div>
```

### 边框类
```html
<div class="border border-primary rounded-lg p-4">
    带边框和圆角的容器
</div>
```

### 阴影类
```html
<div class="shadow-lg p-4">
    带阴影的容器
</div>
```

## VS Code集成

DC Style提供了VS Code扩展，为工具类提供智能提示功能。

### 安装

1. 打开VS Code
2. 进入扩展面板（`Ctrl+Shift+X`）
3. 搜索"DC Style Intellisense"
4. 点击"安装"

### 特性

- **智能补全** - 工具类自动提示
- **文档预览** - 悬停查看工具类说明
- **使用示例** - 查看工具类使用示例
- **多语言支持** - 支持HTML、CSS、SCSS、Vue和React文件

## 构建和开发

### 开发模式
```bash
npm run dev
```

### 构建生产版本
```bash
npm run build
```

### 构建监视模式
```bash
npm run build:watch
```

### 代码格式化
```bash
npm run format
```

## 文件结构

```
dcstyle/
├── src/
│   ├── css/          # SCSS源文件
│   │   ├── _*.scss   # 模块化组件
│   │   ├── dc.scss   # 主入口
│   │   └── themes/   # 主题文件
│   ├── dist/         # 构建输出
│   │   ├── dc.css    # 开发版本
│   │   ├── dc.min.css # 压缩版本
│   │   └── dc.umd.js # UMD格式
│   └── types/        # TypeScript类型定义
├── scripts/          # 构建脚本
├── vscode-extension/ # VS Code插件
├── package.json      # 项目配置
├── rollup.config.js  # 构建配置
└── README.md         # 文档
```

## 浏览器支持

- Chrome (last 2 versions)
- Firefox (last 2 versions)
- Safari (last 2 versions)
- Edge (last 2 versions)

## 许可证

MIT License

## 贡献

欢迎提交Issue和Pull Request来改进这个项目。

## 更新日志

### v1.0.0
- 初始版本发布
- 完整的工具类系统
- 11种内置主题
- 响应式设计支持
- npm包支持
- UMD格式支持
- VS Code插件支持
