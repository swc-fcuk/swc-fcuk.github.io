var path = require('path');

module.exports = {
  //cache: true,
  entry: './src/index.jsx',
  output: {
    filename: './dist/bundle.js'
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

  },
  externals: {
    'react': 'React',
    'react-dom': 'ReactDOM'
  }
};
