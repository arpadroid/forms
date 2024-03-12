import { mergeObjects } from '@arpadroid/tools';
import OptionsField from '../optionsField/optionsField.js';
const html = String.raw;

/**
 * @typedef {import('../optionsField/optionsFieldInterface.js').OptionsFieldInterface} OptionsFieldInterface
 */

/**
 * Represents a custom select field element.
 */
class SelectField extends OptionsField {
    /**
     * Returns the default configuration for the select field.
     * @returns {OptionsFieldInterface} The default configuration object.
     * @protected
     */
    getDefaultConfig() {
        return mergeObjects(super.getDefaultConfig(), {
            iconRight: 'keyboard_arrow_down',
            inputTemplate: html`<select id="{id}" class="optionsField__options fieldInput">{options}</select>`,
            optionTemplate: html`<option role="option">{label}</option>`
        });
    }

    /**
     * Initializes the input element for the select field.
     * @protected
     */
    initializeInput() {
        /**
         * The input element for the select field.
         * @type {HTMLSelectElement}
         */
        this.input = this.querySelector('select');
    }
}

customElements.define('select-field', SelectField);

export default SelectField;
