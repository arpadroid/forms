import PreviewConfig from '@arpadroid/arpadroid/src/storybook/preview.ui.js';
const parameters = PreviewConfig.parameters;
/** @type { import('@storybook/web-components').Preview } */
export default {
    ...PreviewConfig,
    parameters: {
        ...parameters,
        options: {
            ...parameters.options,
            storySort: {
                order: ['Components', 'Fields']
            }
        }
    }
};
