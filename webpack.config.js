var webpack = require('webpack');
var path = require('path');

var sourcePath = path.join(__dirname, './src');
var outPath = path.join(__dirname, './dist');

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
                use: [
                    'awesome-typescript-loader'
                ]
            },
        ],
    },

    plugins: [

    ],

    devtool: 'inline-source-map',

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
