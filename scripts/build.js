const fs = require('fs');
const path = require('path');
const sass = require('sass');

// 清理dist目录
function cleanDist() {
  const distPath = path.join(__dirname, '..', 'dist');
  if (fs.existsSync(distPath)) {
    fs.rmSync(distPath, { recursive: true, force: true });
  }
  fs.mkdirSync(distPath, { recursive: true });
  console.log('✓ 清理dist目录完成');
}

// 简单的CSS压缩函数
function minifyCSS(css) {
  return css
    .replace(/\/\*[\s\S]*?\*\//g, '') // 移除注释
    .replace(/\s+/g, ' ') // 压缩空格
    .replace(/;\s*}/g, '}') // 移除最后的分号
    .replace(/\s*{\s*/g, '{') // 压缩大括号
    .replace(/;\s*/g, ';') // 压缩分号
    .trim();
}

// 构建CSS文件
function buildCSS() {
  try {
    console.log('🚀 开始构建CSS文件（使用 Sass 编译）...');

    const entry = path.join(__dirname, '..', 'src', 'css', 'dc.scss');
    if (!fs.existsSync(entry)) {
      console.error('❌ 找不到入口文件: src/css/dc.scss');
      process.exit(1);
    }

    // 使用 dart-sass 进行编译（若失败则回退为简单合并，以兼容现有项目）
    try {
      const result = sass.renderSync({
        file: entry,
        includePaths: [path.join(__dirname, '..', 'src', 'css')],
        outputStyle: 'expanded'
      });

      const compiledCSS = result.css.toString();
      const cssPath = path.join(__dirname, '..', 'dist', 'dc.css');
      fs.writeFileSync(cssPath, compiledCSS);

      console.log('✓ CSS 编译完成（dc.css）');
      return compiledCSS;
    } catch (sassError) {
      // On Sass compilation errors, fail the build immediately. Do not silently fall back.
      console.error('❌ Sass 编译失败，构建终止：', sassError.message);
      // Print stack when available for easier debugging in CI logs
      if (sassError.stack) console.error(sassError.stack);
      process.exit(2);
    }
  } catch (error) {
    console.error('❌ CSS构建失败:', error.message);
    process.exit(1);
  }
}

// 构建压缩版本
function buildMinified() {
  try {
    console.log('🔧 开始构建压缩版本...');

    // 读取开发版本
    const cssPath = path.join(__dirname, '..', 'dist', 'dc.css');
    if (!fs.existsSync(cssPath)) {
      console.log('⚠️  开发版本不存在，先构建开发版本...');
      buildCSS();
    }

    const cssContent = fs.readFileSync(cssPath, 'utf8');
    const minifiedCSS = minifyCSS(cssContent);

    // 写入压缩CSS文件
    const minPath = path.join(__dirname, '..', 'dist', 'dc.min.css');
    fs.writeFileSync(minPath, minifiedCSS);

    console.log('✓ 压缩版本构建完成');
  } catch (error) {
    console.error('❌ 压缩版本构建失败:', error.message);
    process.exit(1);
  }
}

// Note: SCSS source files are no longer copied into dist to keep the npm package small.

// 主构建流程
function main() {
  console.log('🏗️  开始构建DC CLI Style...\n');

  cleanDist();
  buildCSS();
  buildMinified();

  console.log('\n🎉 DC CLI Style构建完成！');
  console.log('📦 输出文件:');
  console.log('  - dist/dc.css (开发版本)');
  console.log('  - dist/dc.min.css (生产版本)');
  // SCSS source files are kept in the repository (src/css/) but are not copied into dist by default.
}

// 执行构建
if (require.main === module) {
  main();
}

module.exports = { cleanDist, buildCSS, buildMinified };