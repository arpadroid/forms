import { mergeObjects } from '@arpadroid/tools';
import OptionsField from '../optionsField/optionsField.js';

const html = String.raw;

/**
 * @typedef {import('../optionsField/optionsFieldInterface.js').OptionsFieldInterface} OptionsFieldInterface
 */

/**
 * Represents a radio field.
 */
class RadioField extends OptionsField {
    /**
     * Returns the default configuration for the radio field.
     * @returns {OptionsFieldInterface} The default configuration.
     */
    getDefaultConfig() {
        return mergeObjects(super.getDefaultConfig(), {
            optionTemplate: html`<radio-option role="option"></radio-option>`,
            inputAttributes: { type: 'radio' }
        });
    }

    /**
     * Returns the value of the selected radio option.
     * @returns {string|null} The value of the selected radio option, or null if no option is selected.
     */
    getValue() {
        return this.optionsNode?.querySelector('input[type="radio"]:checked')?.value || super.getValue();
    }
}

customElements.define('radio-field', RadioField);

export default RadioField;
