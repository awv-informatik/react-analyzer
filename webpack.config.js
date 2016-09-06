var webpack = require('webpack');

module.exports = {
    entry: [
        'webpack-dev-server/client?http://localhost:8080',
        'webpack/hot/only-dev-server',
        "./main.js",
    ],
    output: {
        path: './',
        path: __dirname,
        filename: "bundle.js"
    },
    module: {
        loaders: [
            { test: /.jsx?$/, exclude: /node_modules/, loaders: ['react-hot', 'babel'] }
        ]
    },
    plugins: [
        new webpack.ProvidePlugin ({ ReactDOM: 'react-dom', React: 'react' }),
        /*new webpack.DefinePlugin({ 'process.env': { 'NODE_ENV': JSON.stringify('production') } }),
        new webpack.optimize.OccurrenceOrderPlugin(true),
        new webpack.optimize.UglifyJsPlugin({ mangle: true, compress: { warnings: false } })*/
    ]
};
