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
    },

    externals: {
        'winjs': 'WinJS',
        'react': 'React',
        'react-dom': 'ReactDOM'
    }
};
