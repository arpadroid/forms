/**
 * Storybook preview configuration.
 * This file imports the preview configuration from the module and exports it.
 * Add your Storybook preview configuration overrides here if needed.
 */
import PreviewConfig from '@arpadroid/module/storybook/preview';
import { bootstrapDecorator } from '@arpadroid/module/storybook/decorators';
import { setService } from '@arpadroid/context';
import { APIService, Router } from '@arpadroid/services';
import { mergeObjects } from '@arpadroid/tools';

const config = mergeObjects(
    PreviewConfig,
    {
        parameters: {
            options: {
                // storySort: {
                //     order: ['Forms', ['Form', 'Field', 'Fields']]
                // }
            }
        },
        decorators: [
            bootstrapDecorator(() => {
                setService('apiService', APIService);
                setService('router', new Router());
            })
        ]
    },
    { mergeArrays: true }
);

export default { ...config };