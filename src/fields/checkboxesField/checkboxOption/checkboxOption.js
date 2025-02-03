/**
 * @typedef {import('../../optionsField/fieldOption/fieldOption.types').FieldOptionConfigType} FieldOptionConfigType
 * @typedef {import('../../checkboxesField/checkboxesField.js').default} RadioField
 */

import RadioOption from '../../radioField/radioOption/radioOption.js';
import CheckboxesField from '../checkboxesField.js';

/**
 * Represents a checkbox option.
 */
class CheckboxOption extends RadioOption {
    /** @type {CheckboxesField} */ // @ts-ignore
    field = this.field;
    /**
     * Renders the input element for the checkbox option.
     * @returns {string} The rendered input element.
     */
    renderInput() {
        const name = this.field.getId() + '[]';
        return super.renderInput('checkbox', name);
    }

    async _onConnected() {
        await super._onConnected();
        if (this.input && this.field) {
            this.input.checked = this.field?.hasValue(this.getAttribute('value'));
        }
    }

    /**
     * Handles the change event of the checkbox option.
     * @param {Event} event - The onChange event.
     * @param {boolean} [callOnChange] - Indicates whether to call the onChange callback.
     */
    _onChange(event, callOnChange = true) {
        console.log('_onChange');
        const input = /** @type {HTMLInputElement} */ (event?.target);
        const checked = input?.checked;
        /** @type {string | number | boolean} */
        let value = input?.value;
        
        if (!isNaN(Number(value))) {
            value = Number(value);
        }
        if (checked) {
            this.field?.addValue(value);
        } else {
            this.field?.removeValue(value);
        }
        super._onChange(event, callOnChange);
    }
}

customElements.define('checkbox-option', CheckboxOption);

export default CheckboxOption;
