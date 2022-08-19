const AwsSamPlugin = require("aws-sam-webpack-plugin");
const awsSamPlugin = new AwsSamPlugin();
const path = require('path');
const MiniCssExtractPlugin = require("mini-css-extract-plugin")

module.exports = {
  entry: () => awsSamPlugin.entry(),
  output: {
    path: path.resolve("."),
    filename: (chunkData) => awsSamPlugin.filename(chunkData),
    libraryTarget: 'commonjs'
  },
  target: 'node',
  mode: 'production',

  // Add the AWS SAM Webpack plugin
  plugins: [
    awsSamPlugin,
    new MiniCssExtractPlugin({
      filename: '/.aws-sam/build/[name]/styles.css',
    })
  ],

  module: {
    rules: [
      { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader" },
      {
        test: /\.svg$/,
        oneOf: [
            {
                include: path.resolve(__dirname, '../node_modules/package-name/'),
                use: 'svg-inline-loader'
            },
            {
                exclude: path.resolve(__dirname, '../node_modules/package-name/'),
                use: 'url-loader'
            }
        ]
      },
      {
        test: /\.(woff|ttf|otf|eot|woff2)$/i,
        loader: "file-loader"
      },
      {
        test: /\.[s]?css$/,
        include: [
          path.join(__dirname, "/hello-world/src"),
          path.join(__dirname, "node_modules")
        ],
        use: [
          MiniCssExtractPlugin.loader,
          { loader: "css-loader", options: { modules: true} },
          // { loader: "sass-loader" }
        ]
      }
    ]
  }

}

/*
example
https://hackernoon.com/deploying-a-node-js-twitter-bot-on-aws-lambda-using-webpack-df6e2e187a78
*/