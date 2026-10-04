/** @typedef {import('../optionsField/optionsField.types').OptionsFieldConfigType} OptionsFieldConfigType */
import { defineCustomElement, mergeObjects } from '@arpadroid/tools';
import OptionsField from '../optionsField/optionsField.js';

class RadioField extends OptionsField {
    /**
     * Returns the default configuration for the radio field.
     * @returns {OptionsFieldConfigType} The default configuration.
     */
    getDefaultConfig() {
        return mergeObjects(super.getDefaultConfig(), {
            optionComponent: 'radio-option',
            optionsAttributes: {
                'aria-labelledby': '{labelId}'
            }
        });
    }

    getFieldType() {
        return 'radio';
    }

    /**
     * Returns the value of the selected radio option.
     * @returns {string|null|unknown} The value of the selected radio option, or null if no option is selected.
     */
    getValue() {
        /** @type {HTMLInputElement | null | undefined} */
        const input = /** @type {HTMLInputElement | null} */ (this.input?.querySelector('input[type="radio"]:checked'));
        return input?.value || super.getValue();
    }
}

defineCustomElement('radio-field', RadioField);

export default RadioField;
