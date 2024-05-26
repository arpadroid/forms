/** @type { import('@storybook/web-components-webpack5').StorybookConfig } */
const config = {
    stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
    staticDirs: ['../dist', '../src', '../assets'],
    addons: [
        '@storybook/addon-webpack5-compiler-swc',
        '@storybook/addon-links',
        '@storybook/addon-essentials',
        '@storybook/addon-a11y',
        // '@chromatic-com/storybook',
        // '@storybook/addon-storysource',
        '@storybook/addon-interactions',
        '@chromatic-com/storybook'
    ],
    framework: {
        name: '@storybook/web-components-webpack5',
        options: {}
    },
    docs: {}
};

export default config;
