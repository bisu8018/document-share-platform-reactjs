const path = require("path");
const webpack = require("webpack");
const paths = require("./paths");
const getClientEnvironment = require("./env");

const publicPath = paths.servedPath;
const publicUrl = publicPath.slice(0, -1);
const env = getClientEnvironment(publicUrl);

module.exports = {
  mode: "production",
  entry: paths.ssrJs,
  target: "node", // bundling for node.js env
  output: {
    path: paths.ssrBuild,
    filename: "index.js",
    // allows to import the file via require()
    libraryTarget: "commonjs2",
    globalObject: "this",
  },
  module: {
    rules: [
      {
        oneOf: [
          {
            test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
            exclude: paths.appStatic,
            loader: require.resolve("url-loader"),
            options: {
              limit: 10000,
              name: "/static/media/[name].[hash:8].[ext]"
            }
          },
          {
            test: /\.(js|mjs|jsx|ts|tsx)$/,
            include: paths.appSrc,
            loader: require.resolve("babel-loader"),
            options: {
              customize: require.resolve(
                "babel-preset-react-app/webpack-overrides"
              ),

              plugins: [
                [
                  require.resolve("babel-plugin-named-asset-import"),
                  {
                    loaderMap: {
                      svg: {
                        ReactComponent: "@svgr/webpack?-svgo,+ref![path]"
                      }
                    }
                  }
                ]
              ],
              cacheDirectory: true,
              cacheCompression: true,
              compact: true
            }
          },
          {
            test: /\.(js|mjs)$/,
            exclude: /@babel(?:\/|\\{1,2})runtime/,
            loader: require.resolve("babel-loader"),
            options: {
              presets: [
                [
                  require.resolve("babel-preset-react-app/dependencies"),
                  { helpers: true }
                ]
              ],
              cacheDirectory: true,
              cacheCompression: true,
              sourceMaps: false
            }
          },
          /* css-loader/locals does not create the output */
          {
            test: /\.(css)$/,
            loader: require.resolve("css-loader/locals")
          },
          {
            test: /\.s[ac]ss$/i,
            use: [
              // Creates `style` nodes from JS strings
              'style-loader',
              // Translates CSS into CommonJS
              'css-loader',
              // Compiles Sass to CSS
              {
                loader : 'sass-loader',
                options: {
                  data: '$env: ' + process.env.NODE_ENV_SUB + ';',
                },
              },
            ],
          },
          /* emitFile: false will not create new files */
          {
            loader: require.resolve("file-loader"),
            exclude: [/\.js$/, /\.html$/, /\.json$/],
            options: {
              name: "/static/media/[name].[hash:8].[ext]",
              // it only generates the url to be used in the app
              emitFile: false
            }
          },
          {
            loader: require.resolve("node-loader"),
            include: paths.appSrc,
            test: /\.node$/
          }
        ]
      }
    ]
  },
  resolve: {
    alias: {
      "swarm-js": path.resolve(__dirname, "../node_modules/swarm-js/lib/api-browser.js"),
      "websocket": path.resolve(__dirname, "../node_modules/socket.io-client/lib")
    },
    extensions: [".js", ".jsx", ".node"],
    modules: ["node_modules", paths.appNodeModules].concat(
      process.env.NODE_PATH.split(path.delimiter).filter(Boolean)
    )
  },
  plugins: [
    new webpack.DefinePlugin(env.stringified),
    new webpack.IgnorePlugin(/^(?:electron|ws)$/),
    new webpack.NormalModuleReplacementPlugin(/^any-promise$/, "bluebird")
  ]
};
