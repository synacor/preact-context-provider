import memory from 'rollup-plugin-memory';
import buble from 'rollup-plugin-buble';
import { uglify } from 'rollup-plugin-uglify';

export default function(config) {
	let format = config.format;
	return {
		external: ['preact'],
		output: {
			strict: false,
			exports: format==='es' ? null : 'named',
			globals: {
				preact: 'preact'
			}
		},
		plugins: [
			format==='umd' && memory({
				path: 'src/cjs.js',
				contents: "export { default } from './index';"
			}),
			buble({ jsx: 'h' }),
			format!=='es' && uglify()
		].filter(Boolean)
	};
}
