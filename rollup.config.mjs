import { getBuild, isSlim } from '@arpadroid/module/src/rollup/builds/rollup-builds.mjs';
const { build } = getBuild('forms', 'uiComponent', {
    external: isSlim() && ['lists']
});
export default build;
