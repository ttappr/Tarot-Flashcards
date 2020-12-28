const HtmlWebpackPlugin         = require('html-webpack-plugin');
const {CleanWebpackPlugin}      = require('clean-webpack-plugin');
const path                      = require('path');
const autoprefixer              = require('autoprefixer');
const CopyWebpackPlugin         = require('copy-webpack-plugin');
const SWPrecacheWebpackPlugin   = require('sw-precache-webpack-plugin');
const WebpackPwaManifest        = require('webpack-pwa-manifest');

const PUBLIC_PATH = 'https://ttappr.github.io/Tarot-Flashcards/';
//const PUBLIC_PATH = 'http://localhost:8000';

module.exports = [{
    entry: './www/index.js',
    output: {
      filename: '[name].bundle.js',
      path: path.resolve(__dirname, 'platforms/webpack'),
      publicPath: PUBLIC_PATH,
    },
    module: {
      rules: [
        {
          test: /\.scss$/,
          use: [
            {
              loader: 'file-loader',
              options: {
                name: 'bundle.css',
              },
            },
            { loader: 'extract-loader' },
            { loader: 'css-loader' },
            {
              loader: 'postcss-loader',
              options: {
                postcssOptions: {
                  plugins: () => [autoprefixer()]
                }
              }
            },
            {
              loader: 'sass-loader',
              options: {
                // Prefer Dart Sass
                implementation: require('sass'),
  
                // See https://github.com/webpack-contrib/sass-loader/issues/804
                webpackImporter: false,
                sassOptions: {
                  includePaths: ['./node_modules']
                },
              },
            },
          ]
        },
        {
            test: /\.(png|svg|jpg|jpeg|gif)$/i,
            type: 'asset/resource',
        },
        {
            test: /\.html$/i,
            loader: 'html-loader',
        },
      ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: "Tarot Flashcards",
        }),
        new CleanWebpackPlugin(),
        new CopyWebpackPlugin({
            patterns: [
                {from: 'www/img', to: 'img'},
            ],
        }),
        new SWPrecacheWebpackPlugin({
            cacheId: 'Tarot-Flashcards',
            dontCacheBustUrlsMatching: /\.\w{8}\./,
            filename: 'service-worker.js',
            minify: true,
            navigateFallback: PUBLIC_PATH + 'index.html',
            staticFileGlobsIgnorePatterns: [/\.map$/, /manifest\.json$/]
        }),
        new WebpackPwaManifest({
            name: 'Tarot Flashcards',
            short_name: 'FlashTarot',
            description: 'A simple flashcard app for memorizing Tarot card meanings.',
            display: 'fullscreen', // other options: minimal-ui, fullscreen, standalone, browser.
            orientation: 'portrait-primary',
            background_color: '#01579b',
            theme_color: '#01579b',
            'theme-color': '#01579b',
            start_url: '/',
            icons: [
              {
                src: path.resolve('www/img/sun.jpeg'),
                sizes: [96, 128, 192, 256, 384, 512],
                destination: path.join('assets', 'icons')
              }
            ]
          })
    ],
    devServer: {
        contentBase: path.join(__dirname, 'www'), //'platforms/webpack'),
        compress: true,
        port: 8000
    },    
  }];

// For development build and dev server, make sure there's a source map for 
// debugging.
if (new Set(['dev', 'serve']).has(process.env.npm_lifecycle_event)) {  
  // Some other types of source map: 'inline-source-map', 'cheap-source-map'.
  let sourceMap = 'eval-source-map';
  module.exports[0].devtool = sourceMap;
  console.info(`>>--> ${sourceMap} will be generated.\n`);
}
