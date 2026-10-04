/**
 * @typedef {import('./checkboxField.types').CheckboxFieldConfigType} CheckboxFieldConfigType
 */
import { defineCustomElement, mergeObjects } from '@arpadroid/tools';
import Field from '../field/field.js';
const html = String.raw;

class CheckboxField extends Field {
    /** @type {CheckboxFieldConfigType} */
    _config = this._config;

    /** @returns {CheckboxFieldConfigType} */
    getDefaultConfig() {
        return mergeObjects(super.getDefaultConfig(), {
            className: 'arpaField',
            classNames: ['checkboxField'],
            inputType: 'checkbox',
            inputTag: 'input',
            nodesConfig: {
                label: { isContent: true }
            }
        });
    }

    getFieldType() {
        return 'checkbox';
    }

    $renderTemplate() {
        return html`
            <label for="{id}" class="arpaField__input checkboxField__label fieldLabel buttonInput">
                {icon} {label} {iconRight} {errors} {tooltip} {input}
            </label>
            {description}
        `;
    }

    getInput() {
        this.input = /** @type {HTMLInputElement | undefined} */ (this.querySelector('input[type="checkbox"]'));
        return this.input;
    }

    /** @returns {boolean} */
    getValue() {
        return Boolean(this?.getInput()?.checked ?? super.getValue());
    }

    /** @returns {boolean} */
    validateRequired() {
        if (!this.isRequired()) {
            return true;
        }
        !this.input?.checked && this.setError(this.i18n('errRequired'));
        return Boolean(this.input?.checked);
    }
}

defineCustomElement('checkbox-field', CheckboxField);

export default CheckboxField;
