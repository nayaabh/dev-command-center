var webpack = require('webpack')
var path = require('path')
module.exports = {
    entry: path.join(__dirname, "src/index.js"),
    output: {
        path: path.join(__dirname, "dist/js"),
        filename: "index.js",
        publicPath: "js"
    },
    devServer: {
        inline: true,
        contentBase: './dist',
        port: 8080
    },
    externals: ['ws'],
    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: /(node_modules)/,
                loader: ["babel-loader"]
            },
            {
                test: /\.json$/,
                exclude: /(node_modules)/,
                loader: ["json-loader"]

            },
            {
                test: /\.less$/,
                exclude: /(node_modules)/,
                use: [{
                    loader: "style-loader"
                }, {
                    loader: "css-loader"
                }, {
                    loader: "less-loader"
                }]
            }
        ]
    }
}