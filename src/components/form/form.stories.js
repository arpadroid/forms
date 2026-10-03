/**
 * @typedef {import('./form.js').default} Form
 * @typedef {import('./form.types.js').FormConfigType} FormConfigType
 * @typedef {import('../../fields/passwordField/passwordField.js').default} PasswordField
 * @typedef {import('@storybook/web-components-vite').Meta<FormConfigType>} Meta
 * @typedef {import('@storybook/web-components-vite').StoryObj<FormConfigType>} Story
 */

import { expect, waitFor, userEvent, fn } from 'storybook/test';
import { attrString } from '@arpadroid/tools';
import { defaultParams, testParams } from '@arpadroid/module/storybook/helper';

const html = String.raw;

/**
 * Sets up the play function for the form stories.
 * @param {HTMLElement} canvasElement - The canvas element of the story.
 * @returns {Promise<{form: Form | null, submitButton: HTMLButtonElement, onSubmitMock: ReturnType<typeof fn>}>} The setup result containing the canvas, form, submit button, and onSubmit mock function.
 */
export async function playSetup(canvasElement) {
    await customElements.whenDefined('arpa-form');
    /** @type {Form | null} */
    const form = canvasElement.querySelector('arpa-form');
    await form?.waitForArpaNodes();
    await form?.promise;
    await new Promise(resolve => setTimeout(resolve, 50));

    const submitButton = /** @type {HTMLButtonElement} */ (canvasElement.querySelector('button[type="submit"]'));
    const onSubmitMock = fn(() => true);
    form?.onSubmit(onSubmitMock);
    await form?.promise;
    return { form, submitButton, onSubmitMock };
}

/** @type {Meta} */
const FormStory = {
    title: 'Forms/Form',
    component: 'arpa-form',
    excludeStories: ['playSetup'],
    parameters: {
        layout: 'padded'
    },
    args: {
        id: 'demo-form',
        title: 'Demo Form',
        debounce: 0,
        successMessage: 'Form submitted successfully!',
        errorMessage: 'Form submission failed!',
        variant: undefined
    },
    render: args => {
        const commonGroupConfig = attrString({ open: false, 'remember-toggle': true });
        return html`
            <arpa-form ${attrString(args)}>
                <arpa-zone name="messages">
                    <info-message> This is an informational message.</info-message>
                </arpa-zone>
                <div class="arpaForm__column">
                    <group-field id="text-group" icon="stylus" label="Text Fields" ${commonGroupConfig}>
                        <text-field id="text-field" label="Text"></text-field>
                        <email-field id="email-field" label="Email"></email-field>
                        <url-field id="url" label="URL" value="https://www.google.com"></url-field>
                        <color-field id="color" label="Color" value="#CCFF00"></color-field>
                        <search-field id="search" label="Search" value="search"></search-field>
                        <textarea-field id="textarea-field" label="Text Area" value="some value"></textarea-field>
                        <password-field id="password-field" confirm label="Password field"> </password-field>
                        <hidden-field id="hiddenField" value="hidden value"></hidden-field>
                    </group-field>
                    <group-field icon="calendar_clock" label="Date & Time Fields" id="date-group" ${commonGroupConfig}>
                        <date-field id="date-field" label="Date Field"></date-field>
                        <date-time-field id="date-time-field" label="Date Time Field"></date-time-field>
                        <time-field id="time-field" label="Time Field"></time-field>
                        <week-field id="week" label="Week"></week-field>
                        <month-field id="month" label="Month"></month-field>
                    </group-field>
                    <group-field icon="pin" label="Numeric Fields" open="false" id="numeric-group" ${commonGroupConfig}>
                        <number-field id="number-field" label="Number"></number-field>
                        <tel-field id="tel" label="Tel" value="1234567890"></tel-field>
                        <range-field id="range" label="Range" min="1" max="100" step="3" value="50"> </range-field>
                    </group-field>
                </div>

                <div class="arpaForm__column">
                    <group-field icon="list_alt" label="Select Fields" id="select-group" ${commonGroupConfig}>
                        <select-field id="select-field" label="Select Field"></select-field>
                        <select-combo has-search id="select-combo" label="Select Combo">
                            <select-option value="1" label="Option 1"></select-option>
                            <select-option value="2" label="Option 2"></select-option>
                            <select-option value="3" label="Option 3"></select-option>
                        </select-combo>
                        <tag-field
                            value="AB-E::Albert Einstein,NE-CQ::Martin Luther King Jr.,NE-BG::William Shakespeare,NE-ZE::Zora Neale Hurston,NE-ZH::Zlatan Ibrahimovic"
                            id="tag-field"
                            label="Tag Field"
                        ></tag-field>
                    </group-field>
                    <group-field icon="toggle_on" label="Toggle Fields" id="toggle-group" ${commonGroupConfig}>
                        <radio-field id="radio-field" label="Radio Field">
                            <radio-option value="1" label="Option 1"></radio-option>
                            <radio-option value="2" label="Option 2"></radio-option>
                            <radio-option value="3" label="Option 3"></radio-option>
                        </radio-field>
                        <checkboxes-field label="Checkboxes Field" id="checkboxes-field" value="option1, option2">
                            <checkbox-option value="option1" label="Option 1"></checkbox-option>
                            <checkbox-option value="option2" label="Option 2"></checkbox-option>
                            <checkbox-option value="option3" label="Option 3"></checkbox-option>
                        </checkboxes-field>
                        <checkbox-field id="checkbox-field" label="Checkbox Field"></checkbox-field>
                    </group-field>
                    <group-field icon="photo_library" label="File Fields" id="file-group" ${commonGroupConfig}>
                        <file-field has-drop-area extensions="txt, docx, pdf" id="file-field" label="File field">
                            <file-item
                                size="10000"
                                src="http://localhost:8000/demo/assets/The Strange Case of Dr Jekyll and Mr Hyde.txt"
                            >
                            </file-item>
                        </file-field>
                        <image-field has-drop-area id="image-field" label="Image field">
                            <image-item src="test-assets/girl.jpg"></image-item>
                        </image-field>
                    </group-field>
                </div>
            </arpa-form>
            <script type="module">
                import { People, MusicGenres, queryPeople } from '../../demo/demoFormOptions.js';

                customElements.whenDefined('arpa-form').then(() => {
                    const form = document.getElementById('demo-form');
                    form.onSubmit(values => {
                        console.log('Form values', values);
                        return true;
                    });
                    form.getField('select-field').setOptions(MusicGenres);
                    form.getField('select-combo').setOptions(MusicGenres);
                    form.getField('tag-field').setFetchOptions(queryPeople);
                });
            </script>
        `;
    }
};

/** @type {Story} */
export const Default = {
    name: 'All fields',
    parameters: defaultParams
};

/** @type {Story} */
export const Test = {
    args: {
        debounce: 10,
        successMessage: 'Form submitted successfully!',
        errorMessage: 'Form submission failed!'
    },
    parameters: testParams,
    play: async ({ canvasElement, step, canvas }) => {
        const setup = await playSetup(canvasElement);
        const { submitButton, form } = setup;
        await step('Renders the form.', () => {
            expect(canvas.getByText('Demo Form')).toBeTruthy();
            expect(canvas.getByText('Text Fields')).toBeTruthy();
            expect(canvas.getByText('Date & Time Fields')).toBeTruthy();
            expect(canvas.getByText('Numeric Fields')).toBeTruthy();
            expect(canvas.getByText('Select Fields')).toBeTruthy();
            expect(canvas.getByText('Toggle Fields')).toBeTruthy();
            expect(canvas.getByText('File Fields')).toBeTruthy();
        });

        await step('Submits the form and receives configured error message from missing required fields', async () => {
            await userEvent.click(submitButton);
            await waitFor(() => {
                expect(canvas.getByText('Form submission failed!')).toBeTruthy();
            });
        });

        await step('Fills in the required fields and submits the form', async () => {
            const passwordField = /** @type {PasswordField | undefined} */ (form?.getField('password-field'));
            await passwordField?.promise;
            await passwordField?.confirmField?.promise;
            passwordField?.setValue('P455w0rd!!');
            passwordField?.confirmField?.setValue('P455w0rd!!');
            await userEvent.click(submitButton);
            await waitFor(() => {
                expect(canvas.getByText('Form submitted successfully!')).toBeTruthy();
            });
        });
    }
};

/** @type {Meta} */
export default FormStory;
