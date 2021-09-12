const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const terserWebpackPlugin = require('terser-webpack-plugin')

module.exports = {
    mode: 'production',
    entry: path.join(__dirname, 'src/app', 'index'),
    watch: false,
    output: {
        path: path.join(__dirname, 'dist'),
        publicPath: '/',
        filename: 'app.[hash].js',
        chunkFilename: '[name].js'
    },
    optimization: {
        minimize: true,
        minimizer: [new terserWebpackPlugin({}), new OptimizeCSSAssetsPlugin({})]
    },
    plugins: [
        new HtmlWebpackPlugin({
            inject: true,
            template: './src/template/index.html'
        }),
        new MiniCssExtractPlugin({
            filename: '[name].[hash].css',
            chunkFilename: '[id].css'
        }),
        new CopyWebpackPlugin({
            patterns: [{
                from: './src/assets/images/',
                to: 'assets/images/'
            }]
        })
    ],
    module: {
        rules: [
            {
                test: /\.(html)+$/,
                use: {
                    loader: 'html-loader'
                }
            }, {
                test: /\.(styl)$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            publicPath: './'
                        }
                    },
                    {
                        loader: 'css-loader',
                        options: { url: false, sourceMap: true }
                    },
                    'stylus-loader'
                ]
            }, {
                test: /\.ts?$/,
                loader: 'ts-loader'
            },
        ]
    },
    resolve: {
        extensions: ['.json', '.js', '.ts']
    },
}