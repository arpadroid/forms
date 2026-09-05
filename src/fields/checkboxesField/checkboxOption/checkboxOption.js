/**
 * @typedef {import('../../optionsField/fieldOption/fieldOption.types').FieldOptionConfigType} FieldOptionConfigType
 * @typedef {import('../../checkboxesField/checkboxesField.js').default} RadioField
 */

import { defineCustomElement, mergeObjects } from '@arpadroid/tools';
import RadioOption from '../../radioField/radioOption/radioOption.js';
import CheckboxesField from '../checkboxesField.js';

/**
 * Represents a checkbox option.
 */
class CheckboxOption extends RadioOption {
    /** @type {CheckboxesField} */
    field = this.field;

    /**
     * @returns {FieldOptionConfigType}
     */
    getDefaultConfig() {
        /** @type {FieldOptionConfigType} */
        const config = {
            attributeList: ['value']
        };
        return mergeObjects(super.getDefaultConfig(), config);
    }

    /**
     * Renders the input element for the checkbox option.
     * @returns {string} The rendered input element.
     */
    renderInput() {
        const name = this.field.getId() + '[]';
        return super.renderInput('checkbox', name);
    }

    async $onComplete() {
        const val = this.getAttribute('value');
        /** @todo Remove this setTimeout. */
        await new Promise(resolve => setTimeout(resolve, 10));
        this.input = this.querySelector('input');
        if (this.input && this.field) {
            this.input.checked = this.field?.hasValue(val);
        }
    }

    /**
     * Handles the change event of the checkbox option.
     * @param {Event} event - The onChange event.
     * @param {boolean} [callOnChange] - Indicates whether to call the onChange callback.
     */
    _onChange(event, callOnChange = true) {
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

defineCustomElement('checkbox-option', CheckboxOption);

export default CheckboxOption;
