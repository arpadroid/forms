import { nodeResolve } from '@rollup/plugin-node-resolve';
import { dts } from 'rollup-plugin-dts';
import terser from '@rollup/plugin-terser';
import copy from 'rollup-plugin-copy';
import watch from 'rollup-plugin-watch';

const WATCH_ALL = process.env['watch'] === 'all';
const WATCH = Boolean(process.env['watch']);
const SLIM = process.env['slim'] === 'true';

export default [
    {
        input: 'src/index.js',
        plugins: [
            terser(),
            nodeResolve(),
            copy({
                targets: [
                    {
                        src: 'node_modules/@arpadroid/ui/dist/material-symbols',
                        dest: 'dist'
                    },
                    {
                        src: 'node_modules/@arpadroid/ui/dist/themes/default/fonts',
                        dest: 'dist/themes/default'
                    },
                    { src: 'src/demo', dest: 'dist' }
                ]
            }),
            WATCH && watch({ dir: 'src/themes' }),
            WATCH_ALL && watch({ dir: 'node_modules/@arpadroid/ui/dist' })
        ],
        output: {
            file: 'dist/arpadroid-forms.js',
            format: 'es'
        }
    },
    SLIM && {
        input: 'src/index.js',
        external: ['@arpadroid/ui', '@arpadroid/i18n', '@arpadroid/tools', '@ungap/custom-elements'],
        plugins: [terser()],
        output: {
            file: 'dist/arpadroid-forms--slim.js',
            format: 'es'
        }
    },
    {
        input: './src/types.d.ts',
        output: [{ file: 'dist/types.d.ts', format: 'es' }],
        plugins: [dts()]
    }
].filter(Boolean);
