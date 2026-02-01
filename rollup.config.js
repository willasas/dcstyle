const resolve = require('@rollup/plugin-node-resolve');
const commonjs = require('@rollup/plugin-commonjs');
const postcss = require('rollup-plugin-postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const fs = require('fs');
const path = require('path');

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
          autoprefixer()
        ],
        extract: true,
        minimize: false
      })
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
            preset: 'default'
          })
        ],
        extract: true,
        minimize: true
      })
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
          autoprefixer()
        ],
        inject: true,
        minimize: false
      })
    ]
  }
];
