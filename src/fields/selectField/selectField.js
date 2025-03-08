/** @typedef {import('./selectField.types').SelectFieldConfigType} SelectFieldConfigType */
import { defineCustomElement, mergeObjects } from '@arpadroid/tools';
import OptionsField from '../optionsField/optionsField.js';
const html = String.raw;

class SelectField extends OptionsField {
    /** @type {HTMLSelectElement} */
    input = this.input;
    /** @type {SelectFieldConfigType} */
    _config = this._config;
    /**
     * Returns the default configuration for the select field.
     * @returns {SelectFieldConfigType} The default configuration object.
     */
    getDefaultConfig() {
        return mergeObjects(super.getDefaultConfig(), {
            iconRight: 'keyboard_arrow_down',
            inputTemplate: html`<select id="{id}" class="optionsField__options fieldInput">
                {options}
            </select>`,
            optionComponent: 'option',
            optionTemplate: html`<{optionComponent} role="option" {selected}>{label}</{optionComponent}>`
        });
    }

    getFieldType() {
        return 'select';
    }

    _initializeInputNode() {
        const input = this.querySelector('select');
        super._initializeInputNode(input);
        input?.addEventListener('change', this._callOnChange);
    }

    async _initializeValue() {
        const value = this.getProperty('value');
        if (value && this.input) {
            this.input.value = value;
        }
    }

    updateValue() {
        this.selectedOption = this.getSelectedOption();
    }
}

defineCustomElement('select-field', SelectField);

export default SelectField;
