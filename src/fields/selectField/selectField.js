/** @typedef {import('../optionsField/optionsFieldInterface.js').OptionsFieldInterface} OptionsFieldInterface */
import { mergeObjects } from '@arpadroid/tools';
import OptionsField from '../optionsField/optionsField.js';
const html = String.raw;

class SelectField extends OptionsField {
    /**
     * Returns the default configuration for the select field.
     * @returns {OptionsFieldInterface} The default configuration object.
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

    _initializeValue() {
        const value = this.getProperty('value');
        if (value && this.input) {
            this.input.value = value;
        }
    }

    updateValue() {
        this.selectedOption = this.getSelectedOption();
    }
}

customElements.define('select-field', SelectField);

export default SelectField;
