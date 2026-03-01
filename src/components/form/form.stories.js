/**
 * @typedef {import('../../fields/field/field.types').FieldConfigType} FieldConfigType
 * @typedef {import('../../fields/field/field.js').default} Field
 * @typedef {import('./form.js').default} Form
 * @typedef {import('../../fields/passwordField/passwordField.js').default} PasswordField
 * @typedef {import('@storybook/web-components-vite').Meta} Meta
 * @typedef {import('@storybook/web-components-vite').StoryObj} StoryObj
 * @typedef {import('@storybook/web-components-vite').StoryContext} StoryContext
 * @typedef {import('@storybook/web-components-vite').Args} Args
 */

import { expect, waitFor } from 'storybook/test';
import { attrString } from '@arpadroid/tools';
import { getArgs, getArgTypes, playSetup, renderContent, renderScript } from './form.stories.util';

const html = String.raw;

/** @type {Meta} */
const FormStory = {
    title: 'Forms/Form',
    parameters: {
        layout: 'padded'
    },
    tags: [],
    render: (args, story) => {
        return html`
            <arpa-form ${attrString(args)}>${renderContent(args, story)}</arpa-form>
            ${renderScript(args, story)}
        `.trim();
    }
};

/** @type {StoryObj} */
export const Default = {
    name: 'All fields',
    parameters: {
        options: {
            selectedPanel: 'storybook/controls/panel'
        }
    },
    args: {
        ...getArgs()
    },
    argTypes: getArgTypes()
};

/** @type {StoryObj} */
export const Test = {
    args: {
        ...Default.args,
        id: 'demo-form',
        title: 'Demo Form',
        debounce: 10,
        successMessage: 'Form submitted successfully!',
        errorMessage: 'Form submission failed!'
    },
    parameters: {
        controls: { disable: true },
        usage: { disable: true },
        options: { selectedPanel: 'storybook/interactions/panel' }
    },

    play: async ({ canvasElement, step }) => {
        const setup = await playSetup(canvasElement);
        const { submitButton, form, canvas } = setup;
        await step('Renders the form.', () => {
            expect(setup.canvas.getByText('Demo Form')).toBeTruthy();
            expect(setup.canvas.getByText('Text Fields')).toBeTruthy();
            expect(setup.canvas.getByText('Date & Time Fields')).toBeTruthy();
            expect(setup.canvas.getByText('Numeric Fields')).toBeTruthy();
            expect(setup.canvas.getByText('Select Fields')).toBeTruthy();
            expect(setup.canvas.getByText('Toggle Fields')).toBeTruthy();
            expect(setup.canvas.getByText('File Fields')).toBeTruthy();
        });

        await step('Submits the form and receives configured error message from missing required fields', async () => {
            submitButton?.click();
            await waitFor(() => {
                expect(canvas.getByText('Form submission failed!')).toBeTruthy();
            });
        });

        await step('Fills in the required fields and submits the form', async () => {
            
            const passwordField = /** @type {PasswordField | undefined} */(form?.getField('password-field'));
            await passwordField?.promise;
            await passwordField?.confirmField?.promise;
            passwordField?.setValue('P455w0rd!!');
            passwordField?.confirmField?.setValue('P455w0rd!!');
            requestAnimationFrame(() => submitButton?.click());
            await waitFor(() => {
                expect(canvas.getByText('Form submitted successfully!')).toBeTruthy();
            });
        });
    }
};

/** @type {Meta} */
export default FormStory;
