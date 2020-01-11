const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const FileManager = require('filemanager-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const BrotliPlugin = require('brotli-webpack-plugin');
const commonWebpackConfig = require('./webpack.common')();

const outputPath = commonWebpackConfig.output.path;
const packageData = require('./package.json');
const fontAwesomePackageData = require('@fortawesome/fontawesome-free/package.json');

const publicOutput = merge(commonWebpackConfig, {
    mode: 'production',
    module: {
        rules: [
            {
                test: /\.m?js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            }
        ]
    },
    plugins: [
        new webpack.DefinePlugin({
            PRODUCTION: true
        }),
        new FileManager({
            onStart: {
                delete: [
                    `${outputPath}/assets`
                ]
            }
        }),
        new CompressionPlugin({
            minRatio: 1
        }),
        new BrotliPlugin({
            asset: '[path].br'
        })
    ],
    optimization: {
        minimizer: [
            new OptimizeCssAssetsPlugin({
                cssProcessorPluginOptions: {
                    preset: [
                        'default', 
                        { 
                            discardComments: { 
                                removeAll: true 
                            } 
                        }
                    ],
                }
            }),
            new TerserPlugin({
                terserOptions: {
                    output: {
                        comments: false,
                    },
                },
                cache: true,
                parallel: true,
                exclude: /css\/.+\.js$/
            }),
            new webpack.BannerPlugin({
                entryOnly: false,
                banner: () => {
                    const today = new Date();
                    const year = today.getFullYear();
                    const { title, version, license, description, author, repository } = packageData;

                    const banner = [
                        `${title}\n`,
                        `Version: ${version}\n`,
                        `Github: ${repository.url}\n`,
                        `License: ${license}\n`,
                        `Description: ${description}\n`,
                        `Copyright 2019-${year} ${author.name}\n\n`,
                        `Font Awesome: v${fontAwesomePackageData.version}\n`,
                        `File: [filebase]\n`,
                        `Path: [file]`
                    ];
                    
                    return banner.join('');
                }
            })
        ],
        minimize: true
    },
    performance: {
        hints: false
    }
});
const outputResolvePath = path.resolve(__dirname, 'docs');
const docsOutput = merge(publicOutput, {
    output: {
        path: outputResolvePath
    },
    plugins: [
        new FileManager({
            onEnd: {
                copy: [
                    {
                        source: `${outputPath}/*.{html,br,gz}`,
                        destination: outputResolvePath
                    }
                ]
            }
        })
    ]
});

module.exports = [
    publicOutput,
    docsOutput
];