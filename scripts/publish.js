const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// 检查package.json版本
function checkVersion() {
  const packagePath = path.join(__dirname, '..', 'package.json');
  const packageData = JSON.parse(fs.readFileSync(packagePath, 'utf8'));

  console.log(`📦 当前版本: ${packageData.version}`);
  return packageData.version;
}

// 检查是否已构建
function checkBuild() {
  const distPath = path.join(__dirname, '..', 'dist');
  const cssPath = path.join(distPath, 'dc.css');
  const minPath = path.join(distPath, 'dc.min.css');

  if (!fs.existsSync(distPath) || !fs.existsSync(cssPath) || !fs.existsSync(minPath)) {
    console.log('⚠️  检测到未构建，开始自动构建...');
    execSync('npm run build', { stdio: 'inherit', cwd: path.join(__dirname, '..') });
  }
}

// 发布到npm
function publishToNPM() {
  try {
    console.log('🚀 发布到npm...');
    execSync('npm publish', { stdio: 'inherit', cwd: path.join(__dirname, '..') });
    console.log('✅ 成功发布到npm');
  } catch (error) {
    console.error('❌ npm发布失败:', error.message);
    process.exit(1);
  }
}

// 发布到pnpm（通过npm发布，pnpm会自动同步）
function publishToPnpm() {
  console.log('📦 pnpm会自动从npm同步包');
  console.log('💡 用户可以通过 pnpm add dc-cli-style 安装');
}

// 创建Git标签
function createGitTag(version) {
  try {
    console.log('🏷️  创建Git标签...');
    execSync(`git tag v${version}`, { stdio: 'inherit', cwd: path.join(__dirname, '..') });
    execSync('git push --tags', { stdio: 'inherit', cwd: path.join(__dirname, '..') });
    console.log(`✅ 创建标签 v${version} 成功`);
  } catch (error) {
    console.error('❌ Git标签创建失败:', error.message);
  }
}

// 主发布流程
function main() {
  console.log('🚀 DC CLI Style 发布流程\n');

  const version = checkVersion();
  checkBuild();

  console.log('\n📋 发布检查清单:');
  console.log('✅ 版本检查完成');
  console.log('✅ 构建检查完成');

  // 确认发布
  const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
  });

  readline.question(`\n确认发布版本 v${version} 到npm？(y/N) `, (answer) => {
    if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
      console.log('\n🎯 开始发布流程...\n');

      publishToNPM();
      publishToPnpm();
      createGitTag(version);

      console.log('\n🎉 发布流程完成！');
      console.log('📦 包已发布到:');
      console.log('  - npm: https://www.npmjs.com/package/dc-cli-style');
      console.log('  - pnpm: pnpm add dc-cli-style');
    } else {
      console.log('❌ 发布已取消');
    }

    readline.close();
  });
}

// 执行发布
if (require.main === module) {
  main();
}

module.exports = { checkVersion, checkBuild, publishToNPM, publishToPnpm, createGitTag };