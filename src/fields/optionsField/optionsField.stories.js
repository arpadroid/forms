/**
 * @typedef {import('./optionsField.types.js').OptionsFieldConfigType} OptionsFieldConfigType
 * @typedef {import('@storybook/web-components-vite').Meta<OptionsFieldConfigType>} Meta
 * @typedef {import('@storybook/web-components-vite').StoryObj<OptionsFieldConfigType>} Story
 */

import { expect, fn, waitFor } from 'storybook/test';
import { defaultParams, testParams } from '@arpadroid/module/storybook/helper';
import { $attr } from '@arpadroid/tools';
import { playSetup } from '../field/field.stories';

const html = String.raw;

/** @type {Meta} */
const OptionsFieldStory = {
    title: 'Forms/Fields/Options',
    component: 'options-field',
    args: {
        id: 'options-field',
        label: 'Options field',
        required: true,
        autoFetchOptions: true
    },
    render: args => html`
        <arpa-form id="test-form" debounce="0">
            <options-field ${$attr(args)}>
                <field-option value="option1" icon="grocery" subtitle="Subtitle 1">Option 1</field-option>
                <field-option value="option2" icon="nutrition" subtitle="Subtitle 2">Option 2</field-option>
                <field-option value="option3" icon="person">Option 3</field-option>
            </options-field>
        </arpa-form>
    `
};

/** @type {Story} */
export const Default = {
    name: 'Render',
    parameters: defaultParams
};

/** @type {Story} */
export const Test = {
    parameters: testParams,
    play: async ({ canvasElement, canvas, step }) => {
        const setup = await playSetup({
            tag: 'options-field',
            canvas,
            canvasElement
        });

        const field = /** @type {import('./optionsField.js').default} */ (setup.field);

        await step('Renders the field with three radio options', async () => {
            expect(canvas.getByText('Options field')).toBeInTheDocument();
            expect(canvas.getByText('Option 1')).toBeInTheDocument();
            expect(canvas.getByText('Option 2')).toBeInTheDocument();
            expect(canvas.getByText('Option 3')).toBeInTheDocument();
        });

        await step('Sets fetchOptions, fetches options and renders them', async () => {
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
