const HtmlWebpackPlugin = require('html-webpack-plugin');
const {
    CleanWebpackPlugin
} = require('clean-webpack-plugin');
const path = require('path');
const autoprefixer = require('autoprefixer');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const SWPrecacheWebpackPlugin = require('sw-precache-webpack-plugin');
const WebpackPwaManifest = require('webpack-pwa-manifest');

const DEBUG = new Set(['dev', 'serve']).has(process.env.npm_lifecycle_event);
const PUBLIC_PATH = (DEBUG) ? 'http://localhost:8000/Tarot-Flashcards/' :
    'https://ttappr.github.io/Tarot-Flashcards/';

module.exports = [{
    entry: './www/index.js',
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'platforms/webpack'),
        publicPath: PUBLIC_PATH,
    },
    module: {
        rules: [{
                test: /\.scss$/,
                use: [{
                        loader: 'file-loader',
                        options: {
                            name: 'bundle.css',
                        },
                    },
                    {
                        loader: 'extract-loader'
                    },
                    {
                        loader: 'css-loader'
                    },
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
                test: /\.(png|svg|jpg|jpeg|gif|ico)$/i,
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
            patterns: [{
                from: 'www/img',
                to: 'img'
            }, ],
        }),
        new WebpackPwaManifest({
            name: 'Tarot Flashcards',
            short_name: 'FlashTarot',
            description: 'A simple flashcard app for memorizing Tarot card meanings.',
            display: 'standalone', // other options: minimal-ui, fullscreen, standalone, browser.
            orientation: 'portrait-primary',
            background_color: '#01579b',
            theme_color: '#01579b',
            'theme-color': '#01579b',
            start_url: '/Tarot-Flashcards/',
            icons: [{
                //src: path.resolve('www/img/logo.png'),
                src: path.resolve('www/img/noun_ace of swords_2159393.png'),
                sizes: [96, 128, 144, 192, 256, 384, 512],
                destination: path.join('assets', 'icons'),
                purpose: "any maskable"
            }]
        }),
        new SWPrecacheWebpackPlugin({
            cacheId: 'Tarot-Flashcards',
            dontCacheBustUrlsMatching: /\.\w{8}\./,
            filename: 'service-worker.js',
            minify: true,
            navigateFallback: PUBLIC_PATH + 'index.html',
            staticFileGlobsIgnorePatterns: [/\.map$/, /manifest\.json$/]
        }),
    ],
    devServer: {
        contentBase: path.join(__dirname, 'platforms/webpack'),
        //conentBasePublicPath: '/Tarot-Flashcards/',
        publicPath: '/Tarot-Flashcards/',
        compress: true,
        port: 8000
    },
}];

if (DEBUG) {
    // Some other types of source map: 'inline-source-map', 'cheap-source-map'.
    let sourceMap = 'eval-source-map';
    module.exports[0].devtool = sourceMap;
    console.info(`>>--> ${sourceMap} will be generated.\n`);
}