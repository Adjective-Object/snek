var webpack = require('webpack');
var path = require('path');
var ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
	entry: [
		'./app/index.jsx'
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
            },
            {
                test: /(\.scss?|\.scss?)$/,
                exclude: /(node_modules|bower_components)/,
                loader: ExtractTextPlugin.extract(
                    "style",
                    "css?sourceMap!sass?sourceMap"
                )
            },
            {
            	test: /\.md$/,
            	loader: "jsx-loader!imports?React=react!html-jsx-loader!markdown"
            },
        ],
	},
	devServer: {
		contentBase: "./public",
			noInfo: true, //  --no-info option
			hot: true,
			inline: true
    },
    devtool: "#inline-source-map",
    plugins: [
		new webpack.NoErrorsPlugin(),
        new ExtractTextPlugin("bundle.css", { allChunks: true })
	]
};
