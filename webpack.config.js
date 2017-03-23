var path = require('path');

module.exports = {
  cache: true,
  entry: './index.jsx',
  output: {
    filename: 'browser-bundle.js'
  },
  module: {
    loaders: [
      {
        test: /\.jsx/,
        loader: 'jsx-loader'
      }
    ]
  },
  resolve: {
    //extensions: ['.js', '.ts', '.tsx'],
    //// Fix webpack's default behavior to not load packages with jsnext:main module
    //// (jsnext:main directs not usually distributable es6 format, but es6 sources)
    //mainFields: ['module', 'browser', 'main']
    ////, alias: {
    ////  'react-winjs': path.join(__dirname, '../../react-winjs')
    ////}
  },
  externals: {
    'react': 'React',
    'react-dom': 'ReactDOM'
  }
};
