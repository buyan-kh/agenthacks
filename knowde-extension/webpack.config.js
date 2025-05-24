const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = (env, argv) => {
  const isProduction = argv.mode === "production";

  return {
    entry: {
      popup: "./src/popup/index.tsx",
      background: "./src/background/background.ts",
      content: "./src/content/content.ts",
    },
    output: {
      path: path.resolve(__dirname, "dist"),
      filename: "[name].js",
      clean: true,
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: "ts-loader",
          exclude: /node_modules/,
        },
        {
          test: /\.css$/,
          use: [MiniCssExtractPlugin.loader, "css-loader", "postcss-loader"],
        },
      ],
    },
    resolve: {
      extensions: [".tsx", ".ts", ".js"],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: "./public/popup.html",
        filename: "popup.html",
        chunks: ["popup"],
      }),
      new CopyWebpackPlugin({
        patterns: [
          {
            from: "./public/manifest.json",
            to: "manifest.json",
          },
          {
            from: "./public/icons",
            to: "icons",
            noErrorOnMissing: true,
          },
          {
            from: "./public/content.css",
            to: "content.css",
          },
        ],
      }),
      new MiniCssExtractPlugin({
        filename: "[name].css",
      }),
    ],
    devtool: isProduction ? false : "source-map",
    optimization: {
      minimize: isProduction,
    },
  };
};
