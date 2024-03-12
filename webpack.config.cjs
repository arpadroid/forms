const argv = require('yargs').argv;
const MODE = argv.mode === 'production' ? 'production' : 'development';
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
// const TerserPlugin = require('terser-webpack-plugin');
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const CopyPlugin = require('copy-webpack-plugin');
const StylesheetBundler = require('@arpadroid/stylesheet-bundler');
const cwd = process.cwd();

const themeConfig = {
    path: cwd + '/src/themes/default',
    baseTheme: cwd + '/node_modules/@arpadroid/ui/src/themes/default'
};
const bundler = new StylesheetBundler.ThemesBundler({
    themes: [themeConfig],
    patterns: [cwd + '/src/components/**/*', cwd + '/src/fields/**/*'],
    minify: MODE === 'production'
});

const themeExt = MODE === 'production' ? 'min.css' : 'bundled.css';
module.exports = (async () => {
    await bundler.initialize();
    return [
        {
            entry: './src/index.js',
            target: 'web',
            mode: MODE,
            stats: 'errors-only',
            devServer: {
                port: 9000,
                hot: true,
                open: true,
                watchFiles: ['src/**/*.js', 'src/**/*.ejs', 'src/**/*.html'],
                static: {
                    directory: path.join(__dirname, 'dist')
                }
            },
            experiments: {
                outputModule: true
            },
            resolve: {
                extensions: ['.js']
            },
            module: {
                rules: [
                    {
                        test: /\.js$/,
                        exclude: /node_modules/,
                        use: {
                            loader: 'babel-loader'
                        }
                    },
                    {
                        test: /\.(svg|eot|woff|ttf|svg|woff2)$/,
                        use: [
                            {
                                loader: 'file-loader',
                                options: {
                                    name: 'fonts/[name].[ext]'
                                }
                            }
                        ]
                    }
                ]
            },
            cache: {
                type: 'filesystem'
            },
            output: {
                path: path.resolve(__dirname, 'dist'),
                clean: true,
                module: true,
                publicPath: '/',
                asyncChunks: false,
                filename: 'forms.js',
                library: {
                    type: 'module'
                }
            },
            watchOptions: {
                ignored: ['*.css', 'node_modules']
            },
            plugins: [
                // new BundleAnalyzerPlugin(),
                new HtmlWebpackPlugin({
                    template: 'src/index.ejs',
                    inject: false
                }),
                new webpack.optimize.ModuleConcatenationPlugin(),
                new webpack.DefinePlugin({
                    APPLICATION_MODE: JSON.stringify(MODE)
                }),
                new CopyPlugin({
                    patterns: [
                        {
                            from: 'node_modules/@arpadroid/ui/dist/material-symbols',
                            to: cwd + '/dist/ui/material-symbols'
                        },
                        {
                            from: 'src/demo',
                            to: cwd + '/dist/demo'
                        },
                        {
                            from: `src/themes/default/default.${themeExt}`,
                            to: cwd + `/dist/themes/default/default.${themeExt}`
                        }
                    ]
                })
            ]
        }
    ];
})();
