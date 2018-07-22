var webpack = require('webpack')
var path = require('path')
var HtmlWebPackPlugin = require('html-webpack-plugin')
module.exports = {
    entry: {
        'web/index': path.join(__dirname, "src/index.js"),
    },
    output: {
        path: path.join(__dirname, "dist"),
        filename: "[name].js"
        // publicPath: "js"
    },
    devServer: {
        inline: true,
        contentBase: './dist',
        port: 8080
    },
    devtool: "source-map",
    target: "web",
    externals: ['ws', 'fs'],
    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: ["babel-loader"]
            },
            {
                test: /\.json$/,
                exclude: /node_modules/,
                loader: ["json-loader"]

            },
            {
                test: /\.less$/,
                exclude: /node_modules/,
                use: [{
                    loader: "style-loader"
                }, {
                    loader: "css-loader"
                }, {
                    loader: "less-loader"
                }]
            }
        ]
    },
    plugins: [
        new HtmlWebPackPlugin({
            template: './src/index.html'
        })
    ]
}