// next.config.js
const withAntdLess = require('next-plugin-antd-less');
const path = require('path');

module.exports = withAntdLess({
  // optional
  modifyVars: {
    '@primary-color': '#efb000', // primary color for all components
    '@success-color': '#50c878', // success state color
    '@warning-color': '#e4d00a', // warning state color
    '@error-color': '#e4d00a', // error state color
    '@font-size-base': '14px', // major text font size
    '@heading-color': '#242424', // heading text color
    '@text-color': '#141414', // major text color
    '@text-color-secondary': '#343434', // secondary text color
    '@disabled-color': '#c4c4c4', // disable state color
    '@border-radius-base': '2px', // major border radius
    '@border-color-base': '#d4d4d4', // major border color
  },
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
