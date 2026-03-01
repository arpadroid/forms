/**
 * @typedef {import('./form.js').default} Form
 * @typedef {import('@storybook/web-components-vite').ArgTypes} ArgTypes
 * @typedef {import('@storybook/web-components-vite').StoryContext} StoryContext
 * @typedef {import('@storybook/web-components-vite').Args} Args
 */
import { I18n } from '@arpadroid/i18n';
import { attrString } from '@arpadroid/tools';
import { fn, within } from 'storybook/test';

const html = String.raw;

/**
 * Returns the default arguments for the form stories.
 * @returns {Args} The default arguments.
 */
export function getArgs() {
    return {
        id: 'demo-form',
        title: 'Demo Form',
        debounce: 1000,
        successMessage: I18n.getText('forms.form.msgSuccess'),
        errorMessage: I18n.getText('forms.form.msgError'),
        variant: undefined
    };
}

/**
 * Returns the argument types for the form stories.
 * @param {string} [category='Form Props'] - The category for the argument types in the Storybook table.
 * @returns {ArgTypes} The argument types.
 */
export function getArgTypes(category = 'Form Props') {
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

/**
 * Renders the content of the form component.
 * @param {Args} _args - The story arguments.
 * @param {StoryContext} _story - The story context.
 * @returns {string} The HTML content of the form.
 */
export function renderContent(_args, _story) {
    const commonGroupConfig = attrString({ open: false, 'remember-toggle': true });

    return html`
        <div class="arpaForm__column">
            <group-field id="text-group" icon="stylus" label="Text Fields" ${commonGroupConfig}>
                <text-field id="text-field" label="Text"></text-field>
                <email-field id="email-field" label="Email"></email-field>
                <url-field id="url" label="URL" value="https://www.google.com"></url-field>
                <color-field id="color" label="Color" value="#CCFF00"></color-field>
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
                    <image-item src="test-assets/girl.jpg"></image-item>
                </image-field>
            </group-field>
        </div>
    `;
}

/**
 * Renders the script for the form component.
 * @param {Args} args - The story arguments.
 * @param {StoryContext} story - The story context.
 * @returns {string} The script content.
 */
export function renderScript(args, story) {
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
}

/**
 * Sets up the play function for the form stories.
 * @param {HTMLElement} canvasElement - The canvas element of the story.
 * @returns {Promise<{canvas: ReturnType<typeof within>, form: Form | null, submitButton: HTMLButtonElement | null, onSubmitMock: ReturnType<typeof fn>}>} The setup result containing the canvas, form, submit button, and onSubmit mock function.
 */
export async function playSetup(canvasElement) {
    const canvas = within(canvasElement);
    await customElements.whenDefined('arpa-form');
    /** @type {Form | null} */
    const form = canvasElement.querySelector('arpa-form');
    await form?.promise;
    /** @type {HTMLButtonElement | null} */
    const submitButton = document.querySelector('button[type="submit"]');
    const onSubmitMock = fn(() => true);
    form?.onSubmit(onSubmitMock);
    await form?.promise;
    return { canvas, form, submitButton, onSubmitMock };
}
