import config from '@arpadroid/module/storybook/preview';
import { bootstrapDecorator } from '@arpadroid/module/storybook/decorators';
import { setService } from '@arpadroid/context';
import { Router } from '@arpadroid/services';

export default {
    ...config,
    parameters: {
        ...config.parameters,
        options: {
            ...config.parameters.options,
            storySort: {
                order: ['Forms', ['Form', 'Field', 'Fields']]
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
