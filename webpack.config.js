const path = require("path");
const webpack = require("webpack");

module.exports = {
    entry: "./src/app.js",
    output: {
        path: path.resolve(__dirname, "dist/"),
        filename: "app.js"
    },
    devtool: "cheap-module-source-map",
    plugins: [
      new webpack.DefinePlugin({
        "process.env": {
          "NODE_ENV": JSON.stringify("production")
        }
      })
    ],
    module: {
        loaders: [{
            test: /\.js$/,
            exclude: /node_modules/,
            loader: "babel-loader",
            query: {
                presets: ["react", "env"]
            }
        }, {
            test: /\.(css|scss|sass)$/,
            include: [path.resolve(__dirname, "src/css")],
            loader: ["style-loader", "css-loader", "sass-loader"]
        }, {
            test: /\.(jpe|jpg|woff|woff2|eot|ttf|svg)(\?.*$|$)/,
            loader: ["file-loader?name=/fonts/[name].[ext]"]
        }]
    }
};