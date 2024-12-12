/* eslint-disable sonarjs/no-duplicate-string */
/**
 * @typedef {import('./fieldInterface.js').FieldInterface} FieldInterface
 */
import { I18n } from '@arpadroid/i18n';
import { waitFor, expect, fireEvent } from '@storybook/test';
import FieldStory, { Default as FieldDefault, Test as FieldTest } from '../field/field.stories.js';

const SearchFieldStory = {
    title: 'Fields/Search',
    tags: [],
    render: (args, story) => FieldStory.render(args, story, 'search-field')
};

export const Default = {
    name: 'Render',
    parameters: { ...FieldDefault.parameters },
    argTypes: {
        ...FieldStory.getArgTypes()
    },
    args: {
        ...FieldStory.getArgs(),
        id: 'search-field',
        label: 'Search Field'
    }
};

export const Test = {
    args: Default.args,
    parameters: { ...FieldTest.parameters },
    play: async ({ canvasElement, step }) => {
        const { input, submitButton, canvas, onSubmitMock } = await FieldTest.playSetup(canvasElement);

        await step('Renders the field', async () => {
            await waitFor(() => {
                expect(canvas.getByText('Search Field')).toBeInTheDocument();
                expect(input).toHaveAttribute('placeholder', I18n.getText('common.labels.lblSearch'));
            });
        });

        await step('Submits form with valid field value.', async () => {
            input.value = 'some query';
            await fireEvent.click(submitButton);
            await waitFor(() => {
                expect(onSubmitMock).toHaveBeenCalledWith({ 'search-field': 'some query' });
                canvas.getByText(I18n.getText('forms.form.msgSuccess'));
            });
        });
    }
};

export default SearchFieldStory;
