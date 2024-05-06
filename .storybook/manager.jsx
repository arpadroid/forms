import React from 'react';
import { Source } from '@storybook/blocks';
import { AddonPanel } from '@storybook/components';

import { addons, types } from '@storybook/manager-api';
import { getStoryContextValue } from '@arpadroid/tools';

addons.register('usage/panel', api => {
    addons.add('usage/panel', {
        title: 'Usage',
        paramKey: 'usage',

        match: ({ viewMode }) => viewMode === 'blak',
        type: types.PANEL,
        render: props => {
            const story = api.getCurrentStoryData();
            const usage = getStoryContextValue(story?.id, 'usage');

            return (
                <AddonPanel active={props.active}>
                    <Source code={usage} language="html" dark format="html" />
                </AddonPanel>
            );
        }
    });
});
