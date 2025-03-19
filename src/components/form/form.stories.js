/**
 * @typedef {import('./fieldInterface.js').FieldConfigType} FieldConfigType
 * @typedef {import('./field.js').default} Field
 */
import { I18n } from '@arpadroid/i18n';
import { attrString } from '@arpadroid/tools';
import { waitFor, within, expect, fn, getByText } from '@storybook/test';

const html = String.raw;

const FormStory = {
    title: 'Forms/Form/All Fields',
    parameters: {
        layout: 'padded'
    },
    tags: [],
    render: (args, story, renderContent = FormStory.renderContent, renderScript = FormStory.renderScript) => {
        return html`
            <arpa-form ${attrString(args)}>${renderContent(args, story)}</arpa-form>
            ${renderScript(args, story)}
        `.trim();
    },
    /**
     * Renders the content of the form component.
     * @returns {string} The HTML content of the form.
     */
    renderContent() {
        const commonGroupConfig = attrString({ open: false, 'remember-toggle': true });

        return html`
            <div class="arpaForm__column">
                <group-field id="text-group" icon="stylus" label="Text Fields" ${commonGroupConfig}>
                    <text-field id="text-field" label="Text"></text-field>
                    <email-field id="email-field" label="Email"></email-field>
                    <url-field id="url" label="URL" value="https://www.google.com"></url-field>
                    <color-field id="color" label="Color" value="yellowgreen"></color-field>
                    <search-field id="search" label="Search" value="search"></search-field>
                    <textarea-field id="textarea-field" label="Text Area" value="some value"></textarea-field>
                    <password-field id="password-field" confirm>
                        <zone name="label">Password Field</zone>
                    </password-field>
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
                    <select-combo has-search id="select-combo" label="Select Combo"></select-combo>
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
                        <file-item size="10000" src="/demo/assets/The Strange Case of Dr Jekyll and Mr Hyde.txt"></file-item>
                    </file-field>
                    <image-field has-drop-area id="image-field" label="Image field">
                        <image-item src="http://www.local/arpadroid/forms/assets/girl.jpg"></image-item>
                    </image-field>
                </group-field>
            </div>
        `;
    },
    renderScript: (args, story) => {
        if (story.name === 'Test') {
            return '';
        }
        return html`
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
    },
    getArgs: () => {
        return {
            id: 'demo-form',
            title: 'Demo Form',
            debounce: 1000,
            successMessage: I18n.getText('forms.form.msgSuccess'),
            errorMessage: I18n.getText('forms.form.msgError'),
            variant: undefined
        };
    },
    getArgTypes: (category = 'Form Props') => {
        return {
            id: { control: 'text', table: { category } },
            title: { control: 'text', table: { category } },
            debounce: { control: 'number', table: { category } },
            successMessage: { control: 'text', table: { category } },
            errorMessage: { control: 'text', table: { category } },
            variant: {
                control: 'select',
                options: [undefined, 'mini'],
                table: { category }
            }
        };
    }
};

export const Default = {
    name: 'Render',
    /** @type {FieldConfigType} */

    parameters: {
        options: {
            selectedPanel: 'storybook/controls/panel'
        }
    },
    args: {
        ...FormStory.getArgs()
    },
    argTypes: FormStory.getArgTypes()
};

export const Test = {
    args: Default.args,
    parameters: {
        controls: { disable: true },
        usage: { disable: true },
        options: { selectedPanel: 'storybook/interactions/panel' }
    },
    args: {
        ...Default.args,
        id: 'demo-form',
        title: 'Demo Form',
        debounce: 10,
        successMessage: 'Form submitted successfully!',
        errorMessage: 'Form submission failed!'
    },
    playSetup: async canvasElement => {
        const canvas = within(canvasElement);
        await customElements.whenDefined('arpa-form');
        const form = canvasElement.querySelector('arpa-form');
        const submitButton = getByText(canvasElement, 'Submit').closest('button');
        const onSubmitMock = fn(() => true);
        form.onSubmit(onSubmitMock);
        await form.promise;
        return { canvas, form, submitButton, onSubmitMock };
    },
    play: async ({ canvasElement, step }) => {
        const setup = await Test.playSetup(canvasElement);
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
            submitButton.click();
            await waitFor(() => {
                expect(canvas.getByText('Form submission failed!')).toBeTruthy();
            });
        });

        await step('Fills in the required fields and submits the form', async () => {
            const passwordField = form.getField('password-field');
            passwordField.setValue('P455w0rd!!');
            passwordField.confirmField.setValue('P455w0rd!!');
            requestAnimationFrame(() => submitButton.click());
            await waitFor(() => {
                expect(canvas.getByText('Form submitted successfully!')).toBeTruthy();
            });
        });
    }
};

export default FormStory;
