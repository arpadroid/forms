import { getBuild } from '@arpadroid/arpadroid/src/rollup/builds/rollup-builds.mjs';
const { build } = getBuild('forms', 'uiComponent');
const { build, appBuild } = getBuild('forms', 'uiComponent', {
    patterns: 'fields/**/*'
});
export default build;
