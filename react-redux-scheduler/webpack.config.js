const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
	devServer: {
		contentBase: path.join(__dirname, 'dist'),
		compress: true,
		port: 9000,
		historyApiFallback: true
	},
	devtool: 'cheap-eval-source-map',
	performance: {
		maxEntrypointSize: 10000,
		maxAssetSize: 10000,
		hints: false
	},
	entry: {
		index: './src/index.js'
	},
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: 'bundle.js',
		chunkFilename: '[id][hash].js',
		publicPath: ''
	},
	module: {
		rules: [
			{
				test: /\.(js|jsx)$/,
				exclude: /(node_modules|bower_components)/,
				use: ['babel-loader']
			},
			{
				test: /\.css$/,
				use: [
					{ loader: MiniCssExtractPlugin.loader },
					{
						loader: 'css-loader',
						options: {
							minimize: true,
							sourceMap: true
						}
					}
				]
			},
			{
				test: /\.(html)$/,
				use: {
					loader: 'html-loader',
					options: {
						attrs: [':data-src'],
						minimize: true
					}
				}
			},
			{
				test: /\.(png|jpg|gif|jpeg|ttf|ico)$/,
				use: [
					{
						loader: 'file-loader',
						options: {
							name: '[path][name].[ext]'
						}
					}
				]
			}
		]
	},
	plugins: [
		new HtmlWebpackPlugin({
			title: 'React Redux Scheduler',
			template: __dirname + '/public/index.html',
			inject: 'body',
			filename: 'index.html',
			favicon: 'public/favicon.ico'
		}),
		new MiniCssExtractPlugin({
			filename: '[name]-[hash].css',
			chunkFilename: '[id][hash].css'
		}),
		new UglifyJsPlugin({ sourceMap: true })
	],
	mode: 'production'
};
