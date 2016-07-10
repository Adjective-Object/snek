var webpack = require('webpack');
var path = require('path');

module.exports = {
	entry: [
		'./app/index.jsx' // Your appʼs entry point
	],
	devtool: process.env.WEBPACK_DEVTOOL || 'source-map',
	output: {
		path: path.join(__dirname, 'public'),
		filename: 'bundle.js'
	},
	resolve: {
		extensions: ['', '.js', '.jsx']
	},
	module: {
		loaders: [
            {
                test: /\.jsx?$/,
                exclude: /(node_modules|bower_components)/,
                loader: 'babel-loader',
                query: {
                    presets: ['es2015', 'react']
                }
            }
        ],
	},
	devServer: {
		contentBase: "./public",
			noInfo: true, //  --no-info option
			hot: true,
			inline: true
    },
    plugins: [
		new webpack.NoErrorsPlugin(),
	]
};
