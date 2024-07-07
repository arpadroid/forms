import { getBuild } from '@arpadroid/arpadroid/src/rollup/builds/rollup-builds.mjs';
const { build, appBuild, buildConfig } = getBuild('forms', 'uiComponent');
const external = appBuild.external ?? [];
if (buildConfig.slim) {
    appBuild.external = [...external, '@arpadroid/lists'];
}
export default build;
