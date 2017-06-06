import fs from 'fs';
import memory from 'rollup-plugin-memory';
import buble from 'rollup-plugin-buble';
import uglify from 'rollup-plugin-uglify';

let pkg = JSON.parse(fs.readFileSync('./package.json'));

let format = process.env.FORMAT==='es' ? 'es' : 'umd';

export default {
	entry: 'src/index.js',
	useStrict: false,
	sourceMap: true,
	exports: format==='es' ? null : 'default',
	moduleName: pkg.amdName,
	external: ['preact'],
	globals: { preact: 'preact' },
	plugins: [
		format==='umd' && memory({
			path: 'src/cjs.js',
			contents: "export { default } from './index';"
		}),
		buble({ jsx: 'h' }),
		format==='umd' && uglify({
			output: {
				comments: false
			},
			mangle: {
				toplevel: true
			},
			compress: {
				pure_getters: true,
				pure_funcs: ['classCallCheck', 'possibleConstructorReturn']
			}
		})
	].filter(Boolean),
	targets: format==='es' ? [
		{ format: 'es', dest: pkg.module }
	] : [
		{ format: 'umd', dest: pkg.main },
		{ format: 'cjs', dest: pkg['cjs:main'] }
	]
};
