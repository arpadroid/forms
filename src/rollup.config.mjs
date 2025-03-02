import { getBuild, isSlim } from '@arpadroid/module';
const { build = {} } =
    getBuild('forms', 'uiComponent', {
        external: (isSlim() && ['lists']) || undefined
    }) || {};
export default build;
