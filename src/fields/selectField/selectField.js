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

    /**
     * Initializes the input element for the select field.
     * @protected
     */
    _initializeInputNode() {
        const input = this.querySelector('select');
        super._initializeInputNode(input);
        input?.addEventListener('change', event => {
            this.signal('onChange', this.getValue(), event);
        });
    }

    _initializeValue() {
        const value = this.getProperty('value');
        if (value && this.input) {
            this.input.value = value;
        }
    }
}

customElements.define('select-field', SelectField);

export default SelectField;
