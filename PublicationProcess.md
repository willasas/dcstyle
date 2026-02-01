# 发布流程

- 下面介绍了如何发布到 `npm` 和 `pnpm` 以及 `VS Code` 插件商店

## 一、发布到`npm` 和 `pnpm`

1.准备工作

- 确保已在 [npm官网](https://npmjs.org/) 注册账号
- 确保项目构建成功（`npm run build`）
- 更新 `package.json` 中的版本号（遵循语义化版本）

2.发布步骤

```Bash
# 1. 构建项目（确保输出文件正确）
npm run build

# 2. 登录 npm（首次发布需要）
npm login

# 3. 发布到 npm（pnpm 会自动同步）
npm publish

# 4. 验证发布结果
npm view dcstyle
```

3.注意事项

- 版本号：每次发布需要更新 `version` 字段
- 权限：确保有发布权限（`npm` 账号已验证邮箱）
- 构建产物：确保 `dist` 目录包含所有必要文件
- `pnpm` 同步：发布到 `npm` 后，`pnpm` 会自动索引该包，无需单独发布

## 二、发布到 `VS Code` 插件商店

1.准备工作

- 确保已在 [Visual Studio Marketplace](https://marketplace.visualstudio.com/) 注册发布者账号
- 安装 `VS Code` 插件发布工具 `vsce`
- 更新 `vscode-extension/package.json` 中的版本号（遵循语义化版本）

2.安装 `vsce` 工具


```Bash
# 全局安装 vsce
npm install -g vsce
```

3.发布步骤

```Bash
# 1. 进入插件目录
cd vscode-extension

# 2. 构建插件
npm run compile

# 3. 创建发布者（首次发布需要）
# 访问 https://marketplace.visualstudio.com/manage 创建发布者，获取发布者ID

# 4. 打包插件
vsce package

# 5. 发布到 VS Code 插件商店
vsce publish

# 6. 验证发布结果
# 访问 https://marketplace.visualstudio.com/items?itemName=发布者ID.dcstyle-intellisense
```

4.注意事项

- 发布者ID：需要与 vscode-extension/package.json中的 publisher 字段一致
- 版本号：每次发布需要更新版本号
- 权限：确保发布者账号有发布权限
- 插件大小：确保打包后的插件大小符合 VS Code 市场要求

## 三、完整发布流程

1.发布 `npm` 包

```Bash
# 根目录执行
npm version patch  # 更新版本号（patch/minor/major）
npm run build      # 构建项目
npm login          # 登录 npm
npm publish        # 发布包
```

2.发布 VS Code 插件

```Bash
# 插件目录执行
cd vscode-extension
npm version patch  # 更新版本号
npm run compile    # 构建插件
vsce publish       # 发布到插件市场
```

## 四、验证发布结果

#### npm 包验证

- 访问 [npmjs包管理](https://www.npmjs.com/package/dcstyle) 查看包信息
- 执行 `npm install dcstyle@latest` 测试安装

#### VS Code 插件验证

- 访问 [Visual Studio Marketplace](https://marketplace.visualstudio.com/items?itemName=发布者ID.dcstyle-intellisense) 查看插件信息
- 在 `VS Code` 中插件商店搜索 "DC Style Intellisense" 测试安装和使用

## 五、常见问题处理

### 1. `npm` 包 发布失败

- 检查网络连接和 `npm` 账号权限
- 确保 `package.json` 中的 `name` 字段未被占用
- 确保版本号未重复

### 2. `VS Code` 插件 发发布失败

- 检查 `publisher` 字段是否与市场发布者ID一致
- 确保插件打包成功且大小符合要求
- 检查网络连接和发布者权限

### 3. 版本号管理

- 使用 `npm version` 命令自动更新版本号
- 遵循语义化版本规范（x.y.z）：
  - `patch`：修复 bug（0.0.1 → 0.0.2）
  - `minor`：添加功能（0.1.0 → 0.2.0）
  - `major`：重大变更（1.0.0 → 2.0.0）
- 通过以上步骤，即可将 DC Style 项目成功发布到 `npm` 和 `VS Code` 插件商店，供用户使用。