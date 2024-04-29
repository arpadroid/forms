/** @type { import('@storybook/web-components-webpack5').StorybookConfig } */
const config = {
    stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
    staticDirs: ['../dist', '../src'],
    addons: [
        '@storybook/addon-webpack5-compiler-swc',
        '@storybook/addon-links',
        '@storybook/addon-essentials',
        '@storybook/addon-a11y',
        '@storybook/addon-interactions'
        // '@chromatic-com/storybook',
        // '@storybook/addon-storysource',
    ],
    framework: {
        name: '@storybook/web-components-webpack5',
        options: {}
    },
    docs: {
        autodocs: 'tag'
    }
};

export default config;
