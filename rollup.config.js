const resolve = require('@rollup/plugin-node-resolve');
const commonjs = require('@rollup/plugin-commonjs');
const postcss = require('rollup-plugin-postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const fs = require('fs');
const path = require('path');

// 版权注释
const banner = `/*!
 * DC Style Framework v1.0.0
 * A comprehensive CSS framework with multiple themes and utility classes
 * Author: william
 * License: MIT
 * https://github.com/willasas/dcstyle
 */
`;

// 自定义插件：添加版权注释
function addBanner() {
  return {
    name: 'add-banner',
    writeBundle(options) {
      // 处理单个文件输出
      if (options.file) {
        const outputPath = options.file;
        if (fs.existsSync(outputPath)) {
          const content = fs.readFileSync(outputPath, 'utf8');
          const newContent = banner + content;
          fs.writeFileSync(outputPath, newContent);
        }
      }
      // 处理目录输出
      else if (options.dir) {
        fs.readdirSync(options.dir).forEach(fileName => {
          const outputPath = path.join(options.dir, fileName);
          if (fs.statSync(outputPath).isFile()) {
            const content = fs.readFileSync(outputPath, 'utf8');
            const newContent = banner + content;
            fs.writeFileSync(outputPath, newContent);
          }
        });
      }
    }
  };
}

// 清理dist目录
function cleanDist() {
  const distPath = path.join(__dirname, 'dist');
  if (fs.existsSync(distPath)) {
    fs.rmSync(distPath, { recursive: true, force: true });
  }
  fs.mkdirSync(distPath, { recursive: true });
  console.log('✓ 清理dist目录完成');
}

// 运行清理
cleanDist();

module.exports = [
  // 主CSS构建
  {
    input: 'src/css/dc.scss',
    output: {
      file: 'dist/dc.css',
      format: 'esm'
    },
    plugins: [
      resolve(),
      commonjs(),
      postcss({
        extensions: ['.scss'],
        use: [
          ['sass', {
            includePaths: ['src/css']
          }]
        ],
        plugins: [
          autoprefixer(),
          {
            postcssPlugin: 'remove-comments',
            Once(root) {
              root.walkComments(comment => {
                comment.remove();
              });
            }
          }
        ],
        extract: true,
        minimize: false
      }),
      addBanner()
    ]
  },
  // 压缩CSS构建
  {
    input: 'src/css/dc.scss',
    output: {
      file: 'dist/dc.min.css',
      format: 'esm'
    },
    plugins: [
      resolve(),
      commonjs(),
      postcss({
        extensions: ['.scss'],
        use: [
          ['sass', {
            includePaths: ['src/css']
          }]
        ],
        plugins: [
          autoprefixer(),
          cssnano({
            preset: [
              'default',
              {
                discardComments: {
                  removeAll: true
                }
              }
            ]
          })
        ],
        extract: true,
        minimize: true
      }),
      addBanner()
    ]
  },
  // UMD格式构建（支持原生页面使用）
  {
    input: 'src/css/dc.scss',
    output: {
      file: 'dist/dc.umd.js',
      format: 'umd',
      name: 'DCStyle',
      globals: {
        'dcstyle': 'DCStyle'
      }
    },
    plugins: [
      resolve(),
      commonjs(),
      postcss({
        extensions: ['.scss'],
        use: [
          ['sass', {
            includePaths: ['src/css']
          }]
        ],
        plugins: [
          autoprefixer(),
          {
            postcssPlugin: 'remove-comments',
            Once(root) {
              root.walkComments(comment => {
                comment.remove();
              });
            }
          }
        ],
        inject: true,
        minimize: false
      }),
      addBanner()
    ]
  }
];
