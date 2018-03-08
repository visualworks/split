const path = require("path");
const webpack = require("webpack");
const HTMLWebpackPlugin = require("html-webpack-plugin");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    entry: "./src/index.js",
    output: {
        path: path.resolve(__dirname, "dist/"),
        filename: "index.js"
    },
    module: {
        rules: [
            {
                test: /\.(jsx|js)$/,
                exclude: /node_modules/,
                loader: "babel-loader",
                query: {
                    presets: ["react"]
                }
            },
            {
                test: /\.(css|scss|sass)$/,
                include: [path.resolve(__dirname, "src/css")],
                loader: ["style-loader", "css-loader", "sass-loader"]
            },
            {
                test: /\.(ttf|otf|eot|svg|woff(2)?)(\?[a-z0-9]+)?$/,
                loader: ["file-loader"]
            },
            {
                test: /\.(jpeg|jpg|gif|png|svg)(\?.*$|$)/,
                loader: ["file-loader?name=/img/[name].[ext]"]
            }
        ]
    },
    resolve: {
        modules: [
            "node_modules",
            path.resolve("./src")
        ],
        extensions: [".js", ".jsx", ".scss"]
    },
    performance: {
        hints: "warning",
        maxAssetSize: 600000,
        maxEntrypointSize: 600000,
        assetFilter: function(assetFilename) {
            return assetFilename.endsWith(".css") || assetFilename.endsWith(".js");
        }
    },
    target: "web",
    stats: "detailed",
    mode: "production",
    plugins: [
        new webpack.DefinePlugin({
            "process.env": {
                "NODE_ENV": JSON.stringify("production")
            }
        }),
        new UglifyJsPlugin(),
        new HTMLWebpackPlugin({
            title: "Portal JAL - Aonde está o ônibus?!",
            author: "Visual Works",
            description: "Grupo JAL: O terceiro maior grupo de transportes de passageiros do estado do Rio de Janeiro. A empresa opera desde 1957 e atualmente serve às cidades de São João de Meriti, Nilópolis, Duque de Caxias, Mesquita, Nova Iguaçu, Belford Roxo, Itaguaí, Mangaratiba e Rio de Janeiro.",
            url: "https://www.portaljal.com.br",
            image: "https://www.portaljal.com.br/img/logo-jal.png",
            filename: path.resolve(__dirname, "dist/index.html"),
            template: path.resolve(__dirname, "src/index.html")
        }),
        new CopyWebpackPlugin([
            {
                from: path.resolve(__dirname, "src/img"),
                to: path.resolve(__dirname, "dist/img")
            },
            {
                from: path.resolve(__dirname, "src/fonts"),
                to: path.resolve(__dirname, "dist/fonts")
            }
        ])
    ],
    // advanced
    parallelism: 2,
    profile: true,
    cache: false
};
