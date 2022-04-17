const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin')

module.exports = {
    // 配置入口
    entry: {
        main: './src/main.js',
        about: './src/pages/about/about.js',
        contact: './src/pages/contact/contact.js',
        header: './src/components/header/header.js',
    },
    // 配置出口
    output: {
        path: path.resolve(__dirname, './dist'),
        filename: 'js/[name]-[hash:5].js',
        // publicPath: '/',
    },
    target: 'web',
    optimization: {
        minimize: true, // 可省略，默认最优配置：生产环境，压缩 true。开发环境，不压缩 false
        minimizer: [
            new TerserPlugin({
                parallel: true, // 可省略，默认开启并行
                terserOptions: {
                    toplevel: true, // 最高级别，删除无用代码
                    ie8: true,
                    safari10: true,
                }
            }),
            new CssMinimizerPlugin({
                parallel: true, // 可省略，默认开启并行
                minimizerOptions: {
                    preset: 'advanced', // 需额外安装
                },
            })
        ]

    },
    // devtool: process.env.NODE_ENV === 'production' ? false : 'inline-source-map',
    module: {
        rules: [
            //解析.js
            {
                test: '/\.js$/',
                loader: 'babel',
                exclude: path.resolve(__dirname, 'node_modules'),
                include: path.resolve(__dirname, 'src'),
            },
            // css
            {
                test: /.s?css$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
            },
            // 图片处理
            {
                test: /\.(png|jpg|gif|svg)$/,
                use: {
                    loader: 'file-loader',
                    options: {
                        esModule: false,
                    }
                },
            },
            {
                test: /\.(htm|html)$/i,
                use: ['html-withimg-loader']
            }
        ],

    },
    devServer: {
        compress: true,
        client: {
            progress: true,
        },
        watchFiles: ['src/**/*'],
        hot: true, // 热重载
        open: true
    },
    plugins: [
        new HtmlWebpackPlugin({
            filename: __dirname + '/dist/about.html',
            inject: 'head',
            template: 'html-withimg-loader!' + __dirname + "/src/pages/about/about.html",
            chunks: ['about', 'main'],
            inlineSource: '.(js|css)$',
            minify: {
                // removeComments: true,//删除注释
                collapseWhitespace: true//删除空格
            }
        }),
        new HtmlWebpackPlugin({
            inject: 'head',
            filename: __dirname + '/dist/contact.html',
            template: './src/pages/contact/contact.html',
            chunks: ['contact'],
            inlineSource: '.(js|css)$',
            minify: {
                // removeComments: true,//删除注释
                collapseWhitespace: true//删除空格
            }
        }),
        new HtmlWebpackPlugin({
            inject: 'head',
            filename: __dirname + '/dist/header.html',
            template: './src/components/header/header.html',
            chunks: ['header', 'main'],
            inlineSource: '.(js|css)$',
            minify: {
                // removeComments: true,//删除注释
                collapseWhitespace: true//删除空格
            }
        }),

        new CleanWebpackPlugin(),
        new MiniCssExtractPlugin({
            filename: 'css/[name].[contenthash].css'
        })
    ],


}