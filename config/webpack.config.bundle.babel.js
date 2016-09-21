import webpack from 'webpack';
import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';

const production = process.env.NODE_ENV === 'production';

module.exports = {
    entry: [
        "./app/routes.js",
        "./app/assets/site.styl"
    ],
    output: {
        publicPath: '/',
        path: path.resolve("./"),
        filename: './build/bundle.js',
    },
    module: {
        loaders: [
            { test: /\.styl/, loader: "style-loader!css-loader!autoprefixer-loader!stylus-loader" },
            { test: /\.woff($|\?)|\.woff2($|\?)|\.ttf($|\?)|\.eot($|\?)|\.svg($|\?)/, loader: 'url-loader' },
            { test: /.jsx?$/, exclude: /node_modules/, loader: 'babel' },
            { test: /\.jade$/, loader: 'jade' }
        ]
    },
    worker: { output: { filename: './build/worker.js' } },
    plugins: [
        new webpack.DefinePlugin({ 'process.env': { 'NODE_ENV': JSON.stringify('production') } }),
        new webpack.optimize.OccurrenceOrderPlugin(true),
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.UglifyJsPlugin({ compress: { warnings: false }, mangle: true }),
        new HtmlWebpackPlugin({ title: "awv3node", filename: './build/bundle.html', inject: false, template: './config/template-bundle.jade' })
    ],
    cache: true,
    debug: false
};
