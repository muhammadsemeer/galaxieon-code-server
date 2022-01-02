const path = require("path");
const webpack = require("webpack");
require("dotenv").config();

module.exports = {
  entry: {
    main: "./src/index.ts",
  },
  resolve: {
    extensions: ["", ".webpack.js", ".web.js", ".js", ".ts"],
  },
  output: {
    path: path.join(__dirname, "dist"),
    filename: "[name].js",
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      "process.env": JSON.stringify(process.env),
    }),
  ],
};
