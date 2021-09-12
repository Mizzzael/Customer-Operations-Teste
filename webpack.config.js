const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = {
    mode: 'development',
    entry: path.join(__dirname, 'src/app', 'index'),
    watch: true,
    output: {
        path: path.join(__dirname, 'dist'),
        publicPath: '/',
        filename: 'app.[hash].js',
        chunkFilename: '[name].js'
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
            }
        ]
    },
    resolve: {
        extensions: ['.json', '.js', '.ts']
    },
    devtool: 'source-map',
    devServer: {
        watchFiles: ['src/**/*.styl', 'src/**/*.css', 'src/**/*.html'],
        'compress': true,
        port: 8080,
    }
}