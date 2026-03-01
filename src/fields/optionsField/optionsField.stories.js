/**
 * @typedef {import('./optionsField.js').default} OptionsField
 * @typedef {import('@storybook/web-components-vite').Meta} Meta
 * @typedef {import('@storybook/web-components-vite').StoryObj} StoryObj
 * @typedef {import('@storybook/web-components-vite').StoryContext} StoryContext
 * @typedef {import('@storybook/web-components-vite').Args} Args
 */

/* eslint-disable sonarjs/no-duplicate-string */
import { expect, fn, waitFor } from 'storybook/test';
import FieldStory, { Default as FieldDefault, Test as FieldTest } from '../field/field.stories.js';
import { playSetup, renderField } from '../field/field.stories.util.js';
import { getArgs, getArgTypes, renderFieldContent } from './optionsField.stories.util.js';

/** @type {Meta} */
const OptionsFieldStory = {
    title: 'Forms/Fields/Options',
    tags: [],
    render: (args, story) => renderField(args, story, 'options-field', renderFieldContent)
};

/** @type {StoryObj} */
export const Default = {
    name: 'Render',
    parameters: { ...FieldDefault.parameters },
    argTypes: { ...getArgTypes() },
    args: { ...getArgs() }
};

/** @type {StoryObj} */
export const Test = {
    parameters: { ...FieldTest.parameters },
    args: {
        ...Default.args
    },
    play: async ({ canvasElement, step }) => {
        const setup = await playSetup(canvasElement, { fieldTag: 'options-field' });
        const { canvas } = setup;
        const field = /** @type {OptionsField} */ (setup.field);

        step('Renders the field with three radio options', async () => {
            expect(canvas.getByText('Options field')).toBeInTheDocument();
            expect(canvas.getByText('Option 1')).toBeInTheDocument();
            expect(canvas.getByText('Option 2')).toBeInTheDocument();
            expect(canvas.getByText('Option 3')).toBeInTheDocument();
        });

        step('sets fetchOptions, fetches options and renders them', async () => {
            const fetchOptions = fn(async () => {
                return Promise.resolve([
                    { value: 'option4', label: 'Option 4', icon: 'grocery' },
                    { value: 'option5', label: 'Option 5', icon: 'nutrition' },
                    { value: 'option6', label: 'Option 6', icon: 'person' }
                ]);
            });
            field.setFetchOptions(fetchOptions);
            await waitFor(() => {
                expect(fetchOptions).toHaveBeenCalled();
                expect(canvas.getByText('Option 4')).toBeInTheDocument();
                expect(canvas.getByText('Option 5')).toBeInTheDocument();
                expect(canvas.getByText('Option 6')).toBeInTheDocument();
            });
        });
        await new Promise(resolve => setTimeout(resolve, 50));
        await step('Sets a new list of options to the field', async () => {
            field.setOptions([
                { value: 'option7', label: 'Option 7', icon: 'grocery' },
                { value: 'option8', label: 'Option 8', icon: 'nutrition' }
            ]);
            await waitFor(() => {
                expect(canvas.getByText('Option 7')).toBeInTheDocument();
                expect(canvas.getByText('Option 8')).toBeInTheDocument();
            });
        });
    }
};

export default OptionsFieldStory;
