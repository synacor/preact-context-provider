/* eslint-env node */

module.exports = function(config) {
	config.set({
		browsers: ['jsdom'],
		frameworks: ['mocha', 'chai-sinon'],
		reporters: ['mocha'],
		mochaReporter: { showDiff: true },
		files: [
			{ pattern: 'test/**/*.js', watched: false }
		],
		preprocessors: {
			'{src,test}/**/*': ['webpack', 'sourcemap']
		},
		webpack: {
			module: {
				rules: [{
					test: /\.jsx?$/,
					exclude: /node_modules/,
					loader: 'babel-loader',
					options: {
						presets: [
							['es2015', { loose: true }],
							'stage-0'
						],
						plugins: [
							['transform-react-jsx', { pragma: 'h' }]
						]
					}
				}]
			},
			devtool: 'inline-source-map'
		},
		webpackServer: { noInfo: true }
	});
};
