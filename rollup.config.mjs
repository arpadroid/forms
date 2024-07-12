import alias from './node_modules/@arpadroid/arpadroid/node_modules/@rollup/plugin-alias/dist/cjs/index.js';
import { getBuild } from '@arpadroid/arpadroid/src/rollup/builds/rollup-builds.mjs';
const cwd = process.cwd();
const { build, appBuild, buildConfig, plugins } = getBuild('forms', 'uiComponent');
const external = appBuild.external ?? [];
if (buildConfig.slim) {
    appBuild.external = [...external, '@arpadroid/lists'];
}
const aliases = [{ find: '@arpadroid/forms', replacement: cwd + '/src/index.js' }];
!buildConfig.slim && plugins.push(alias({ entries: aliases }));
export default build;
