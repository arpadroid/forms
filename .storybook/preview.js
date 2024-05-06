import { setStoryContextValue  } from '@arpadroid/tools';

/** @type { import('@storybook/web-components').Preview } */
const preview = {
    decorators: [
        (story, config) => {
            const _story = story();
            setStoryContextValue(config.id, 'usage', _story);
            return _story;
        }
    ],
    parameters: {
        layout: 'padded', //'centered' | 'fullscreen' | 'padded'
        options: {
            storySort: {
                order: ['Components', 'Fields']
            }
        },
        controls: {
            matchers: {
                color: /(background|color)$/i,
                date: /Date$/i
            }
        }
    }
};

export default preview;
