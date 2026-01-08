import { getBuild, isSlim } from '@arpadroid/module';
const external = (isSlim() && ['lists']) || undefined;
const { build } = getBuild('forms', { external });
export default build;
