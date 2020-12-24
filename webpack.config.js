const HtmlWebpackPlugin     = require('html-webpack-plugin');
const {CleanWebpackPlugin}  = require('clean-webpack-plugin');
const path                  = require('path');
const autoprefixer          = require('autoprefixer');

module.exports = [{
    entry: './www/index.js',
    output: {
      filename: '[name].bundle.js',
      path: path.resolve(__dirname, 'platforms/webpack')
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
            test: /\.(png|jpg|jpeg|gif|svg)$/,
            use: [{
                loader: 'file-loader'
            }, ],
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
