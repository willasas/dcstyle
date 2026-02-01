const fs = require('fs');
const path = require('path');

// 检查sass模块是否可用
try {
  const sass = require('sass');
  console.log('✓ sass模块已安装');

  // 尝试编译一个简单的SCSS文件
  const result = sass.compileString('body { color: red; }');
  console.log('✓ SCSS编译测试成功');
  console.log('编译结果:', result.css);
} catch (error) {
  console.error('❌ sass模块加载失败:', error.message);
}