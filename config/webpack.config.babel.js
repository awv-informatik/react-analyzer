import webpack from 'webpack';
import path from 'path';

const production = process.env.NODE_ENV === 'production';

module.exports = {
    entry: {
        site: "./app/routes.js",
        style: "./app/assets/site.styl"
    },
    output: {
        publicPath: '/',
        path: path.resolve("./"),
        filename: './build/[name].js',
    },
    module: {
        loaders: [
            { test: /\.styl/, loader: "style-loader!css-loader!autoprefixer-loader!stylus-loader" },
            { test: /\.woff($|\?)|\.woff2($|\?)|\.ttf($|\?)|\.eot($|\?)|\.svg($|\?)/, loader: 'file-loader?name=./build/[name].[ext]' },
            { test: /.jsx?$/, exclude: /node_modules/, loaders: (production ? [] : [ 'react-hot' ]).concat([ 'babel']) }
        ]
    },
    worker: { output: { filename: './build/worker.js' } },
    plugins: (production ? [
        new webpack.DefinePlugin({ 'process.env': { 'NODE_ENV': JSON.stringify('production') } }),
        new webpack.optimize.OccurrenceOrderPlugin(true),
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.UglifyJsPlugin({ compress: { warnings: false }, mangle: true }),
    ] : []),
    cache: true,
    debug: false
};

console.log(module.exports)
