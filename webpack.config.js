const AwsSamPlugin = require("aws-sam-webpack-plugin");
const awsSamPlugin = new AwsSamPlugin();
const path = require('path');
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const HtmlWebpackPlugin = require('html-webpack-plugin');

const webpack = require("webpack")
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

const nodeExternals = require('webpack-node-externals');


module.exports = [
  {
    name: "browser",
    entry: path.join(__dirname, "/hello-world/src/index.js"),
    output: {
        path: path.join(__dirname, "/.aws-sam/build/HelloWorldFunction"),
        filename: "bundle.js",
        // publicPath: 
        hotUpdateChunkFilename: "hot_update.js",
        hotUpdateMainFilename: "hot_update.json"
    },
    mode:"development",
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
            {
              loader: "file-loader",
              options: {
                name: "[name].css",
                outputPath: "/dist",
                esModule: false,
              }
            },
            {
              loader: "extract-loader",
            },
            // MiniCssExtractPlugin.loader,
            {
              loader: MiniCssExtractPlugin.loader,
              options: {
                publicPath: 'dist', // Set the public path for the CSS file
              },
            },
            {
              loader: "css-loader",
              // options: { modules: true} 
              options: {
                esModule: false,
              }
            },
            // { loader: "sass-loader" }
          ]
        }
        ]
    },
    plugins: [

        new HtmlWebpackPlugin({
          title: "SSR title",
        }),
        new webpack.DefinePlugin({
            __CONFIGS__: JSON.stringify({
                service: 'React-ssr',
                version: '0.2',
                environment: process.env.BUILD_ENVIRONMENT || "local"
            })
        }),
        new webpack.HotModuleReplacementPlugin(), // Enable HMR for client
        new CleanWebpackPlugin({
          cleanOnceBeforeBuildPatterns: ['**/*hot-update*'],
        }),
        new MiniCssExtractPlugin({
            // path:  path.join(__dirname, "/.aws-sam/build/HelloWorldFunction"),
            filename: "dist/styles.css"
        }),
        // new CleanWebpackPlugin(["./static/*.js", "./static/*.json", "./static/styles.css", "./static/*.woff", "./static/*.woff2"]),
        // new WebpackAutoInject({
        //     components: {
        //         AutoIncreaseVersion: false,
        //         InjectAsComment: false,
        //         InjectByTag: true
        //     },
        //     componentsOptions: {
        //         InjectByTag: {
        //             dateFormat: 'yyyymmddHHmmss'
        //         },
        //         AutoIncreaseVersion: {
        //             runInWatchMode: true // it will increase version with every single build!
        //         },
        //     }
        // })
    ]
},
// server
{

  entry: () => awsSamPlugin.entry(),
  output: {
    path: path.resolve("."),
    filename: (chunkData) => awsSamPlugin.filename(chunkData),
    libraryTarget: 'commonjs'
  },
  target: 'node',
  mode: 'development',
  // Add the AWS SAM Webpack plugin
  plugins: [
    awsSamPlugin,
    new MiniCssExtractPlugin({
      filename: 'styles.css',
    }),
    new webpack.HotModuleReplacementPlugin(), // Enable HMR for server
    new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns: ['**/*hot-update*'],
    }),
    // new webpack.ExternalsPlugin('commonjs') 
    // new webpack.IgnorePlugin({
    //   resourceRegExp: /canvas/,
    //   contextRegExp: /jsdom$/,
    // }),
    // new webpack.IgnorePlugin({ resourceRegExp: /jsdom/ })
  ],
  
  resolve: {
      modules: ['node_modules'],
      // alias: {
      //   'react': path.resolve(__dirname, 'node_modules/react')
      // },
  },
  // externalsPresets: {
  //   node: true // in order to ignore built-in modules like path, fs, etc. 
  // },
  // externals: [nodeExternals(
  //   {
  //   // allowlist: ['react', 'react-dom/server', 'react-dom/client', '@react-three/fiber', 'react-dom', 'scheduler']
  //   allowlist: [/react/]
  //   }
  // )], // just add this
  // externals: {
  //   // jsdom: "jsdom",
  //   canvas: {},
  //   bufferutil: "bufferutil",
  //   "utf-8-validate": "utf-8-validate",
  // },
  
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
      },
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      }
    ]
  }
}
]

/*
example
https://hackernoon.com/deploying-a-node-js-twitter-bot-on-aws-lambda-using-webpack-df6e2e187a78
*/