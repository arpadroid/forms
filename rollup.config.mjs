import copy from 'rollup-plugin-copy';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
import { dts } from 'rollup-plugin-dts';
import watch from 'rollup-plugin-watch';
const WATCH_ALL = process.env['watch'] === 'all';
export default [
    {
        input: 'src/index.js',
        plugins: [
            terser(),
            nodeResolve(),
            copy({
                targets: [
                    {
                        src: 'node_modules/@arpadroid/ui/dist/arpadroid-ui.js',
                        dest: 'dist/ui'
                    },
                    {
                        src: 'node_modules/@arpadroid/ui/dist/material-symbols',
                        dest: 'dist/ui'
                    },
                    {
                        src: 'node_modules/@arpadroid/ui/dist/themes/default/fonts',
                        dest: 'dist/themes/default'
                    },
                    { src: 'src/demo', dest: 'dist' }
                ]
            }),
            watch({ dir: 'src/themes' }),
            WATCH_ALL && watch({ dir: 'node_modules/@arpadroid/ui/dist' })
        ],
        output: {
            file: 'dist/arpadroid-forms.js',
            format: 'es'
        }
    },
    {
        input: './src/types.d.ts',
        output: [{ file: 'dist/types.d.ts', format: 'es' }],
        plugins: [dts()]
    }
];
