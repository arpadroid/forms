/* eslint-disable sonarjs/no-duplicate-string */
/**
 * @typedef {import('./fieldInterface.js').FieldInterface} FieldInterface
 */
import { I18n } from '@arpadroid/i18n';
import { waitFor, expect } from '@storybook/test';
import FieldStory, { Default as FieldDefault, Test as FieldTest } from '../field/field.stories.js';

const RangeFieldStory = {
    title: 'Forms/Fields/Range',
    tags: [],
    render: (args, story) => FieldStory.render(args, story, 'range-field')
};

export const Default = {
    name: 'Render',
    parameters: { ...FieldDefault.parameters },
    argTypes: {
        min: {
            control: 'number',
            table: { category: 'Range Props' }
        },
        max: {
            control: 'number',
            table: { category: 'Range Props' }
        },
        step: {
            control: 'number',
            table: { category: 'Range Props' }
        },
        ...FieldStory.getArgTypes('Field Props')
    },
    args: {
        min: '0',
        max: 100,
        step: 1,
        ...FieldStory.getArgs(),
        id: 'range-field',
        label: 'Range Field',
        required: true,
        value: undefined
    }
};

export const Test = {
    args: Default.args,
    parameters: { ...FieldTest.parameters },
    args: {
        ...Default.args,
        required: true,
        value: 25
    },
    play: async ({ canvasElement, step }) => {
        const { submitButton, canvas, onSubmitMock } = await FieldTest.playSetup(canvasElement);

        await step('Submits form with valid field value.', async () => {
            submitButton.click();
            await waitFor(() => {
                expect(onSubmitMock).toHaveBeenCalledWith({ 'range-field': 25 });
                canvas.getByText(I18n.getText('forms.form.msgSuccess'));
            });
        });
    }
};

export default RangeFieldStory;
