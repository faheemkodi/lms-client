// next.config.js
const withAntdLess = require('next-plugin-antd-less');
const path = require('path');

module.exports = withAntdLess({
  // optional
  modifyVars: { '@primary-color': '#cc9100' },
  // optional
  lessVarsFilePath: './src/styles/variables.less',
  // optional
  lessVarsFilePathAppendToEndOfContent: false,
  // optional https://github.com/webpack-contrib/css-loader#object
  cssLoaderOptions: {},

  // Other Config Here...

  webpack(config) {
    return config;
  },
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
  },
});
