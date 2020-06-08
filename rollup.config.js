import babel from '@rollup/plugin-babel';
import { terser } from "rollup-plugin-terser";

export default {
	input: 'src/index.js',
	output: {
		name: 'modapp-utils',
		format: 'umd'
	},
	plugins: [
		babel({ babelHelpers: 'bundled' }),
		(process.env.NODE_ENV === 'production' && terser()),
	],
};
