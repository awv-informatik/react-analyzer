import webpack from 'webpack';
const production = process.env.NODE_ENV === 'production';

module.exports = {
    entry: {
        site: "./index.js",
        styles: "./style.styl"
    },
    output: {
        publicPath: '/',
        path: __dirname,
        filename: 'bundle/[name].js',
    },
    module: {
        loaders: [
            { test: /\.styl/, loader: "style-loader!css-loader!autoprefixer-loader!stylus-loader" },
            { test: /\.woff($|\?)|\.woff2($|\?)|\.ttf($|\?)|\.eot($|\?)|\.svg($|\?)/, loader: 'file-loader?name=bundle/[name].[ext]' },
            { test: /.jsx?$/, exclude: /node_modules/, loaders: (production ? [] : [ 'react-hot' ]).concat([ 'babel']) }
        ]
    },
    externals: {
        three: 'THREE'
    },
    plugins: (production ? [
        new webpack.DefinePlugin({ 'process.env': { 'NODE_ENV': JSON.stringify('production') } }),
        new webpack.optimize.OccurrenceOrderPlugin(true),
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.UglifyJsPlugin({ compress: { warnings: false }, mangle: true })
    ] : []),
    cache: true,
    debug: false
};
