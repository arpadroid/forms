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
            inputType: 'checkbox',
            inputTag: 'input'
        };
        return mergeObjects(super.getDefaultConfig(), config);
    }

    getName() {
        return this.field.getId() + '[]';
    }

    isSelected() {
        return this.field.hasValue(this.getAttribute('value'));
    }

    /**
     * @param {Event} event
     * @param {boolean} [callOnChange]
     */
    onChange(event, callOnChange = true) {
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
        if (callOnChange) {
            this.field?._callOnChange(event);
        }
    }
}

defineCustomElement('checkbox-option', CheckboxOption);

export default CheckboxOption;
