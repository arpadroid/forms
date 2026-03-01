/**
 * @typedef {import('./selectCombo.js').default} SelectCombo
 * @typedef {import('@storybook/web-components-vite').Meta} Meta
 * @typedef {import('@storybook/web-components-vite').StoryObj} StoryObj
 * @typedef {import('@storybook/web-components-vite').StoryContext} StoryContext
 * @typedef {import('@storybook/web-components-vite').Args} Args
 */

/* eslint-disable sonarjs/no-duplicate-string */
import { I18n } from '@arpadroid/i18n';

import { Default as FieldDefault, Test as FieldTest } from '../field/field.stories.js';
import { waitFor, expect, userEvent, fireEvent } from 'storybook/test';
import { CountryOptions } from '../../demo/demoFormOptions.js';
import { getArgs, getArgTypes, playSetup, renderContent, renderField } from '../field/field.stories.util.js';
import { renderScript } from './selectCombo.stories.util.js';

/** @type {Meta} */
const SelectComboStory = {
    title: 'Forms/Fields/SelectCombo',
    tags: [],
    render: (args, story) => {
        delete args.options;
        return renderField(args, story, 'select-combo', renderContent, renderScript);
    }
};

/** @type {StoryObj} */
export const Default = {
    name: 'Render',
    parameters: { ...FieldDefault.parameters },
    argTypes: {
        hasSearch: { control: 'boolean', table: { category: 'Select Combo Props' } },
        debounceSearch: { control: 'number', table: { category: 'Select Combo Props' } },
        ...getArgTypes('Field Props')
    },
    play: async ({ canvasElement }) => {
        const setup = await playSetup(canvasElement, {
            fieldTag: 'select-combo'
        });
        const field = /** @type {SelectCombo} */ (setup.field);
        await customElements.whenDefined('select-combo');
        field.setOptions(CountryOptions);
    },
    args: {
        hasSearch: false,
        ...getArgs(),
        id: 'select-combo-test',
        label: 'Select combo',
        required: true,
        value: 'es'
    }
};

/** @type {StoryObj} */
export const Test = {
    parameters: { ...FieldTest.parameters },
    args: {
        ...Default.args,
        value: undefined,
        options: CountryOptions,
        debounceSearch: 1,
        id: 'select-combo'
    },
    play: async ({ canvasElement, step }) => {
        const setup = await playSetup(canvasElement, { fieldTag: 'select-combo' });
        const { submitButton, canvas, onErrorMock, onChangeMock } = setup;
        let input = /** @type {HTMLInputElement | null} */ (setup.input);
        const field = /** @type {SelectCombo} */ (setup.field);
        if (!input) throw new Error('Input element not found in the setup.');

        await customElements.whenDefined('select-combo');
        await field.promise;
        field.setOptions(CountryOptions);

        await step('Renders the field with four select options', async () => {
            expect(canvas.getByText('Select combo')).toBeInTheDocument();
        });
        await waitFor(() => {
            canvas.getByText('Spain');
        });

        await step('Submits the form without selecting an option and receives required error', async () => {
            submitButton?.click();
            await waitFor(() => {
                expect(onErrorMock).toHaveBeenCalled();
                canvas.getByText(I18n.getText('forms.form.msgError'));
                canvas.getByText(I18n.getText('forms.field.errRequired'));
            });
        });

        await step('Selects the first option and submits the form', async () => {
            await input?.focus();
            const spainButton = canvas.getByText('Spain').closest('button');
            spainButton.click();
            await waitFor(() => {
                expect(onChangeMock).toHaveBeenCalledWith('es', field, expect.anything());
                expect(field.getValue()).toBe('es');
                expect(input).toHaveTextContent('Spain');
            });
            submitButton?.click();
            await waitFor(() => {
                canvas.getByText(I18n.getText('forms.form.msgSuccess'));
                /** @todo Fix flaky test. */
                // expect(onSubmitMock).toHaveBeenLastCalledWith({ 'select-combo': 'es' });
            });
        });

        await step('enables search, performs search and verifies search results', async () => {
            field.setAttribute('has-search', 'true');
            await waitFor(() => {
                input = field.getInput();
                expect(input).toHaveAttribute('type', 'text');
            });
            if (!input) throw new Error('Input element not found after enabling search.');
            await userEvent.type(input, 'United', { delay: 10 });
            await fireEvent.keyUp(input, { key: 'Space' });
            const searchMatches = await waitFor(() => document.querySelectorAll('mark'));
            expect(searchMatches).toHaveLength(2);
            expect(searchMatches[0]).toHaveTextContent('United');
            await fireEvent.click(searchMatches[1]);
            await waitFor(() => {
                expect(onChangeMock).toHaveBeenCalledWith('uk', field, expect.anything());
            });
        });
    }
};

export default SelectComboStory;
