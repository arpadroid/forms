/**
 * @typedef {import('../../components/form/form.types.js').FormConfigType} FormConfigType
 * @typedef {import('@storybook/web-components-vite').Meta<FormConfigType>} Meta
 * @typedef {import('@storybook/web-components-vite').StoryObj<FormConfigType>} Story
 * @typedef {import('../../components/form/form').default} FormComponent
 */
import { waitFor, expect, userEvent } from 'storybook/test';
import { defaultParams, testParams } from '@arpadroid/module/storybook/helper';
import { $attr } from '@arpadroid/tools';
const html = String.raw;

/** @type {Meta} */
const SubmitButtonStory = {
    title: 'Forms/Components/Submit Button',
    tags: [],
    component: 'submit-button',
    args: {
        id: 'submit-button-form',
        debounce: 0,
        submitIcon: 'check_circle'
    },
    render: args =>
        html`<arpa-form ${$attr(args)}>
            <text-field id="text" label="Text" required></text-field>
            <number-field id="number" label="Number" required minLength="0" max-length="20"></number-field>
        </arpa-form>`
};

/** @type {Story} */
export const Default = {
    name: 'Render',
    parameters: defaultParams
};

/** @type {Story} */
export const Test = {
    parameters: testParams,
    play: async ({ canvasElement, step, canvas }) => {
        const form = /** @type { FormComponent } */ (canvasElement.querySelector('arpa-form'));
        await form.onRendered();
        const numberField = /** @type {import('../numberField/numberField').default} */ (form.getField('number'));
        await numberField?.promise;
        const submitButton = await waitFor(() => canvas.getByRole('button', { name: 'Submit' }));
        const textInput = canvas.getByRole('textbox');
        const numberInput = canvas.getByRole('spinbutton');

        await step(
            'Renders the button and expects data-invalid attribute to be present in container since the fields are required',
            async () => {
                expect(textInput).toBeInTheDocument();
                expect(numberInput).toBeInTheDocument();
                expect(submitButton).toBeInTheDocument();
                expect(submitButton).toHaveAttribute('data-invalid');
            }
        );

        await step('Fills the form and expects data-invalid attribute to be removed', async () => {
            await userEvent.type(textInput, 'text');
            await userEvent.type(numberInput, '32');
            await waitFor(() => {
                expect(submitButton).toHaveAttribute('data-invalid');
            });
            await userEvent.clear(numberInput);
            await userEvent.type(numberInput, '20');

            await waitFor(() => expect(submitButton).not.toHaveAttribute('data-invalid'));
        });
    }
};

/** @type {Meta} */
export default SubmitButtonStory;
