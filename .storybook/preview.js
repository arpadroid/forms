import { bootstrapDecorator } from '@arpadroid/arpadroid/src/storybook/decorators.js';
import config from '@arpadroid/arpadroid/src/storybook/preview.ui.js';
import { setService } from '@arpadroid/context';
import { Router } from '@arpadroid/services';

export default {
    ...config,
    decorators: [
        ...config.decorators,
        bootstrapDecorator(() => {
            setService('router', new Router());
        })
    ]
};
