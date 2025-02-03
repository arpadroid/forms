/** @typedef {import('../optionsField/optionsField.types').OptionsFieldConfigType} OptionsFieldConfigType */
import { mergeObjects } from '@arpadroid/tools';
import OptionsField from '../optionsField/optionsField.js';

class RadioField extends OptionsField {
    /**
     * Returns the default configuration for the radio field.
     * @returns {OptionsFieldConfigType} The default configuration.
     */
    getDefaultConfig() {
        return mergeObjects(super.getDefaultConfig(), {
            optionComponent: 'radio-option',
            inputAttributes: { type: 'radio' }
        });
    }

    getFieldType() {
        return 'radio';
    }

    getTagName() {
        return 'radio-field';
    }

    /**
     * Returns the value of the selected radio option.
     * @returns {string|null|unknown} The value of the selected radio option, or null if no option is selected.
     */
    getValue() {
        /** @type {HTMLInputElement | null | undefined} */
        const input = /** @type {HTMLInputElement} */ this.optionsNode?.querySelector('input[type="radio"]:checked');
        return input?.value || super.getValue();
    }
}

customElements.define(RadioField.prototype.getTagName(), RadioField);

export default RadioField;
