const path = require("path");
const webpack = require("webpack");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");

module.exports = {
    entry: "./src/index.js",
    output: {
        path: path.resolve(__dirname, "dist/"),
        filename: "index.js"
    },
    mode: "production",
    devtool: "cheap-module-source-map",
    // devtool: "eval-source-map",
    plugins: [
      new webpack.DefinePlugin({
        "process.env": {
          "NODE_ENV": JSON.stringify("production")
        }
      }),
      new UglifyJsPlugin(),
    ],
    resolve: {
        modules: [path.resolve('./src'), 'node_modules']
    },
    module: {
        rules: [{
            test: /\.js$/,
            exclude: /node_modules/,
            loader: "babel-loader",
            query: {
                presets: ["react"]
            }
        }, {
            test: /\.(css|scss|sass)$/,
            include: [path.resolve(__dirname, "src/css")],
            loader: ["style-loader", "css-loader", "sass-loader"]
        }, {
            test: /\.(jpe|jpg|woff|woff2|eot|ttf|svg)(\?.*$|$)/,
            loader: ["file-loader?./fonts/[name].[ext]"]
        }]
    }
};