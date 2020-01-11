const webpack = require('webpack');
const merge = require('webpack-merge');
const commonWebpackConfig = require('./webpack.common');
const webpackMode = 'development';

module.exports = merge(commonWebpackConfig({ mode:webpackMode }),  {
    mode: webpackMode,
    devtool: 'source-map',
    devServer: {
        host: 'localhost',
        port: 1404,
        open: false,
        progress: true,
        stats: 'errors-only'
    },
    plugins: [
        new webpack.DefinePlugin({
            PRODUCTION: false
        })
    ]
});