const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const autoPreFixer = require('autoprefixer');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const fs = require('fs');
const jsYAML = require('js-yaml');
const fontCategoriesYaml = fs.readFileSync(path.resolve(__dirname, 'node_modules/@fortawesome/fontawesome-free/metadata/categories.yml'));
const fontCategoryObj = jsYAML.safeLoad(fontCategoriesYaml);
const iconsCategory = [];

// Create new icon category object
Object.keys(fontCategoryObj).forEach(function(categoryName) {
    const { label, icons } = fontCategoryObj[categoryName];

    iconsCategory.push({
        name: categoryName,
        label,
        icons
    });
});

const source = 'src';

module.exports = function(webpackOptions = {}) {
    const { mode:webpackMode } = Object.assign({
        'mode': 'production'
    }, webpackOptions);

    const setFileName = function(options = {}) {
        const { filename, placeholder, query:queryStr } = Object.assign({
            filename: null,
            placeholder: 'chunkhash',
            query: 'v'
        }, options);
    
        if (!filename) return false;
    
        return webpackMode === 'production' ? `${filename}?${queryStr}=[${placeholder}]` : filename;
    };

    return {
        context: path.resolve(__dirname, source),
        entry: {
            'assets/dist/js/app': './js/app.js'
        },
        output: {
            path: path.resolve(__dirname, 'public'),
            filename: setFileName({
                filename: '[name].bundle.js',
                placeholder: 'chunkhash'
            }),
            chunkFilename: setFileName({
                filename: '[name].chunk.js',
                placeholder: 'chunkhash'
            })
        },
        module: {
            rules: [
                {
                    test: /\.(ttf|woff|woff2|eot|svg)$/,
                    use: {
                        loader: 'file-loader',
                        options: {
                            name: setFileName({
                                filename: '[name].bundle.[ext]',
                                placeholder: 'contenthash'
                            }),
                            outputPath: 'assets/dist/fonts/',
                            esModule: false
                        }
                    }
                },
                {
                    test: /\.(jpg|jpeg|png|gif|ico)$/,
                    use: {
                        loader: 'file-loader',
                        options: {
                            name: setFileName({
                                filename: '[name].bundle.[ext]',
                                placeholder: 'contenthash'
                            }),
                            outputPath: 'assets/dist/img/',
                            esModule: false
                        }
                    }
                },
                {
                    test: /\.(css|s[ac]ss)$/,
                    use: [
                        {
                            loader: MiniCssExtractPlugin.loader,
                            options: {
                                publicPath: '../../../'
                            }
                        },
                        'css-loader',
                        {
                            loader: 'postcss-loader',
                            options: {
                                sourceMap: true,
                                plugins: [
                                    autoPreFixer
                                ]
                            }
                        },
                        'sass-loader'
                    ]
                },
                {
                    test: /\.ya?ml$/,
                    loader: 'yaml-loader',
                }
            ]
        },
        plugins: [
            new HtmlWebpackPlugin({
                title: 'Font-Awesome CheatSheet',
                minify: {
                    collapseWhitespace: true
                },
                template: 'html/index.html',
                iconsCategory: iconsCategory
            }),
            new MiniCssExtractPlugin({
                filename: setFileName({
                    filename: 'assets/dist/css/style.css',
                    placeholder: 'contenthash'
                })
            })
        ],
        resolve: {
            alias: {
                'js': path.resolve(__dirname, `${source}/js`),
                'libs': path.resolve(__dirname, `${source}/js/libs`),
                'img': path.resolve(__dirname, `${source}/img`),
                'json': path.resolve(__dirname, `${source}/json`),
                'scss': path.resolve(__dirname, `${source}/scss`),
                'font': path.resolve(__dirname, `${source}/font`)
            }
        }
    }
};