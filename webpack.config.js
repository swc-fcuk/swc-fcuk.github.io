var webpack = require('webpack');
var path = require('path');

// variables
var isProduction = process.argv.indexOf('-p') >= 0;
var sourcePath = path.join(__dirname, './src');
var outPath = path.join(__dirname, './dist');

// plugins
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  //cache: true,
  entry: './src/index.tsx',
  output: {
    filename: "bundle.js",
    path: __dirname + "/dist"
  },

  module: {
    loaders: [
      // .ts, .tsx
      {
        test: /\.tsx?$/,
        use: isProduction
          ? 'awesome-typescript-loader?module=es6'
          : [
            //'react-hot-loader',
            'awesome-typescript-loader'
          ]
      },
      // css
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              query: {
                modules: true,
                sourceMap: !isProduction,
                importLoaders: 1,
                localIdentName: '[local]__[hash:base64:5]'
              }
            },
            {
              loader: 'postcss-loader'
            }
          ]
        })
      },
      // static assets
      { test: /\.html$/, use: 'html-loader' },
      { test: /\.png$/, use: 'url-loader?limit=10000' },
      { test: /\.jpg$/, use: 'file-loader' },
    ],
  },
  plugins: [
    //new webpack.LoaderOptionsPlugin({
    //  options: {
    //    context: sourcePath,
    //    postcss: [
    //      require('postcss-import')({ addDependencyTo: webpack }),
    //      require('postcss-url')(),
    //      require('postcss-cssnext')(),
    //      require('postcss-reporter')(),
    //      require('postcss-browser-reporter')({ disabled: isProduction }),
    //    ]
    //  }
    //}),
    //new webpack.optimize.CommonsChunkPlugin({
    //  name: 'vendor',
    //  filename: 'vendor.bundle.js',
    //  minChunks: Infinity
    //}),
    //new webpack.optimize.AggressiveMergingPlugin(),
    //new ExtractTextPlugin({
    //  filename: 'styles.css',
    //  disable: !isProduction
    //}),
    //new HtmlWebpackPlugin({
    //  template: 'assets/index.html'
    //})
  ],

  devtool: 'inline-source-map',

  resolve: {
    // Add '.ts' and '.tsx' as resolvable extensions.
    extensions: [".webpack.js", ".web.js", ".ts", ".tsx", ".js"]
  },

  resolve: {
    extensions: [".webpack.js", ".web.js", ".ts", ".tsx", ".js"],
    // Fix webpack's default behavior to not load packages with jsnext:main module
    // (jsnext:main directs not usually distributable es6 format, but es6 sources)
    mainFields: ['module', 'browser', 'main']
  },
  externals: {
    'winjs': 'WinJS',
    'react': 'React',
    'react-dom': 'ReactDOM'
  }
};
