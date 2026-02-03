import { bootstrapDecorator } from '@arpadroid/module/storybook/decorators';
import { setService } from '@arpadroid/context';
import { Router } from '@arpadroid/services';

export default {
    parameters: {
        options: {
            storySort: {
                order: ['Forms', ['Form', 'Field', 'Fields']]
            }
        }
    },
    decorators: [
        bootstrapDecorator(() => {
            setService('router', new Router());
        })
    ]
};
