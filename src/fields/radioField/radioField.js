/** @typedef {import('../optionsField/optionsFieldInterface.js').OptionsFieldInterface} OptionsFieldInterface */
import { mergeObjects } from '@arpadroid/tools';
import OptionsField from '../optionsField/optionsField.js';

class RadioField extends OptionsField {
    /**
     * Returns the default configuration for the radio field.
     * @returns {OptionsFieldInterface} The default configuration.
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
     * @returns {string|null} The value of the selected radio option, or null if no option is selected.
     */
    getValue() {
        return this.optionsNode?.querySelector('input[type="radio"]:checked')?.value || super.getValue();
    }
}

customElements.define(RadioField.prototype.getTagName(), RadioField);

export default RadioField;
