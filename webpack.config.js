var webpack = require("webpack");
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
	context: __dirname,
	entry: ['./src/js/mip-login-event/mip-login-event.js', './src/js/mip-page/mip-page.js'],
	output: {
		filename: './mip-access/mip-page.js',
	},
	module: {
		loaders: [
			{
				test: /\.(png|jpg|svg|gif)$/i,
				loader: 'file-loader'
			},
			{
				test: /\.css$/,
				loader: ExtractTextPlugin.extract({
					use: 'css-loader'
				})
			}
		]
	},
	plugins: [
		new ExtractTextPlugin('./mip-access/mip-access.css'),
		new CopyWebpackPlugin([
            {
            	from: './src/js/mip-login/mip-login.js',
            	to: './mip-access/mip-login.js'
            },
            {
            	from: './src/js/mip-login-done/mip-login-done.js',
            	to: './mip-access/mip-login-done.js'
            },
            {
            	from: './src/js/mip-access.js',
            	to: './mip-access/mip-access.js'
            },
            {
            	from: './src/css/list.css',
            	to: './mip-access/mip-access.css'
            }
        ]),
		new webpack.optimize.UglifyJsPlugin({
	        compress: {
	          warnings: false
	        }
		})
		// new OptimizeCssAssetsPlugin({
		// 	assetNameRegExp: /\.css$/i,
		// 	cssProcessor: require('cssnano'),
		// 	cssProcessorOptions: { discardComments: {removeAll: true } },
		// 	canPrint: true
	 //    })
	],
	node: {
		fs: 'empty'
	},
}
