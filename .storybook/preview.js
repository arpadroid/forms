import { bootstrapDecorator } from '@arpadroid/arpadroid/src/storybook/decorators.js';
import config from '@arpadroid/arpadroid/src/storybook/preview.ui.js';
import { setService } from '@arpadroid/context';
import { Router } from '@arpadroid/services';

export default {
    ...config,
    parameters: {
        ...config.parameters,
        options: {
            ...config.parameters.options,
            storySort: {
                order: ['Forms', ['Form', 'Field', 'Fields']],
            }
        }
    },
    decorators: [
        ...config.decorators,
        bootstrapDecorator(() => {
            setService('router', new Router());
        })
    ]
};
