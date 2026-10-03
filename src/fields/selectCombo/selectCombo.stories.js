/**
 * @typedef {import('./selectCombo.types.js').SelectComboConfigType} SelectComboConfigType
 * @typedef {import('./selectCombo.js').default} SelectCombo
 * @typedef {import('@storybook/web-components-vite').Meta<SelectComboConfigType>} Meta
 * @typedef {import('@storybook/web-components-vite').StoryObj<SelectComboConfigType>} Story
 */

import { I18n } from '@arpadroid/i18n';
import { waitFor, expect, userEvent } from 'storybook/test';
import { defaultParams, testParams } from '@arpadroid/module/storybook/helper';
import { CountryOptions } from '../../demo/demoFormOptions.js';
import { $attr } from '@arpadroid/tools';
import { playSetup } from '../field/field.stories';

const html = String.raw;

/** @type {Meta} */
const SelectComboStory = {
    title: 'Forms/Fields/SelectCombo',
    component: 'select-combo',
    args: {
        id: 'select-combo-test',
        label: 'Select combo',
        required: true,
        hasSearch: false,
        value: 'es',
        debounceSearch: 500,
        autoFetchOptions: true
    },
    render: args => {
        return html`
            <arpa-form id="test-form" debounce="0">
                <select-combo ${$attr(args)}>
                    <select-option value="es" icon="award_meal">Spain</select-option>
                    <select-option value="fr" icon="local_pizza">France</select-option>
                    <select-option value="de" icon="nightlife">Germany</select-option>
                </select-combo>
            </arpa-form>
        `;
    }
};

/** @type {Story} */
export const Default = {
    name: 'Render',
    parameters: defaultParams
};

/** @type {Story} */
export const Test = {
    parameters: testParams,
    args: {
        value: undefined,
        debounceSearch: 1,
        id: 'select-combo'
    },
    play: async ({ canvasElement, canvas, step }) => {
        const setup = await playSetup({
            tag: 'select-combo',
            canvas,
            canvasElement
        });
        const { submitButton, onErrorMock, onChangeMock, onSubmitMock, input } = setup;
        const field = /** @type {SelectCombo} */ (setup.field);
        onChangeMock.mockClear();

        await step('Renders the field with four select options', async () => {
            expect(canvas.getByText('Select combo')).toBeInTheDocument();
        });
        await waitFor(() => {
            canvas.getByText('Spain');
        });

        await step('Submits the form without selecting an option and receives required error', async () => {
            await userEvent.click(submitButton);
            await waitFor(() => {
                expect(onErrorMock).toHaveBeenCalled();
                canvas.getByText(I18n.getText('forms.form.msgError'));
                canvas.getByText(I18n.getText('forms.field.errRequired'));
            });
        });

        await step('Selects the first option and submits the form', async () => {
            await input?.focus();
            const spainButton = /** @type {HTMLButtonElement} */ (canvas.getByText('Spain').closest('button'));
            await userEvent.click(spainButton);
            await waitFor(() => {
                expect(onChangeMock).toHaveBeenCalledWith('es', field, expect.anything());
                expect(field.getValue()).toBe('es');
                expect(input).toHaveTextContent('Spain');
            });
            await userEvent.click(submitButton);
            await waitFor(() => {
                canvas.getByText(I18n.getText('forms.form.msgSuccess'));
                expect(onSubmitMock).toHaveBeenLastCalledWith({ 'select-combo': 'es' });
            });
        });
    }
};

/** @type {Story} */
export const SearchInput = {
    parameters: testParams,
    args: {
        hasSearch: true,
        value: 'mx'
    },
    render: args => {
        return html`
            <arpa-form id="test-form" debounce="0">
                <select-combo ${$attr(args)}></select-combo>
            </arpa-form>
        `;
    },
    play: async ({ canvasElement, canvas, step }) => {
        const setup = await playSetup({
            tag: 'select-combo',
            canvas,
            canvasElement
        });
        const { onChangeMock, onSubmitMock } = setup;
        const field = /** @type {SelectCombo} */ (setup.field);
        field.setOptions(CountryOptions);
        const searchInput = canvas.getByRole('textbox', { name: /Select combo/i });

        await step('Renders the field', async () => {
            expect(searchInput).toBeInTheDocument();
            await waitFor(() => {
                expect(searchInput).toHaveValue('Mexico');
                expect(field.getValue()).toBe('mx');
            });
        });

        await step('enables search, performs search and verifies search results', async () => {
            await userEvent.clear(searchInput);
            await userEvent.type(searchInput, 'United', { delay: 10 });
            /** @type {any} */
            let match = null;
            await waitFor(() => {
                const searchMatches = canvasElement.querySelectorAll('mark');
                expect(searchMatches).toHaveLength(2);
                expect(searchMatches[0]).toHaveTextContent('United');
                match = searchMatches[1];
            });
            await userEvent.click(match);
            await waitFor(() => {
                expect(onChangeMock).toHaveBeenCalledWith('uk', field, expect.anything());
            });
        });

        await step('submits the form and verifies submission', async () => {
            const submitButton = canvas.getByRole('button', { name: /Submit/i });
            await userEvent.click(submitButton);
            await waitFor(() => {
                canvas.getByText(I18n.getText('forms.form.msgSuccess'));
                expect(onSubmitMock).toHaveBeenCalledWith({ 'select-combo-test': 'uk' });
            });
        });
    }
};

export default SelectComboStory;
