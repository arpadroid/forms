/** @type { import('@storybook/web-components-webpack5').StorybookConfig } */
const html = String.raw;
const config = {
    stories: ['../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
    staticDirs: ['../dist', '../src'],
    addons: [
        '@storybook/addon-webpack5-compiler-swc',
        '@storybook/addon-links',
        '@storybook/addon-essentials',
        '@storybook/addon-a11y',
        '@storybook/addon-interactions',
        '@chromatic-com/storybook'
    ],
    framework: {
        name: '@storybook/web-components-webpack5',
        options: {}
    },
    docs: {},
    previewBody: body => html`
        ${body}
        <script src="http://127.0.0.1:35729/livereload.js?ext=Chrome&amp;extver=2.1.0"></script>
    `,
    webpackFinal: async config => {
        config.watchOptions.aggregateTimeout = 800;
        config.watchOptions.ignored = ['**/*.css'];
        config.module.rules = config.module.rules.filter(rule => {
            const isCSSRule = rule?.test?.toString().includes('css');
            return isCSSRule ? false : true;
        });
        return config;
    }
};

export default config;
