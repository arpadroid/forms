/** @typedef {import('./numberField.types').NumberFieldConfigType} NumberFieldConfigType */
import { defineCustomElement, validateNumber } from '@arpadroid/tools';
import Field from '../field/field.js';
const html = String.raw;
class NumberField extends Field {
    i18nKey = this.getI18nKey();
    _validations = [...super.getValidations(), 'number'];

    /**
     * Returns the default configuration for the number field.
     * @returns {NumberFieldConfigType} The default configuration object.
     */
    getDefaultConfig() {
        return {
            ...super.getDefaultConfig(),
            icon: 'numbers',
            inputAttributes: {
                type: 'number',
                min: this.getProperty('min'),
                max: this.getProperty('max'),
                step: this.getProperty('step')
            }
        };
    }

    /**
     * Sets the minimum value for the number field.
     * @param {number} value - The minimum value.
     */
    setMin(value) {
        this.setAttribute('min', value.toString());
        this.input?.setAttribute('min', value.toString());
    }

    /**
     * Sets the maximum value for the number field.
     * @param {number} value - The maximum value.
     */
    setMax(value) {
        this.setAttribute('max', value.toString());
        this.input?.setAttribute('max', value.toString());
    }

    getFieldType() {
        return 'number';
    }

    getTagName() {
        return 'number-field';
    }

    getI18nKey() {
        return 'forms.fields.number';
    }

    /**
     * Returns the parsed numeric value of the field's input value.
     * @returns {number | undefined}
     */
    getValue() {
        const val = /** @type {string} */ (super.getValue());
        const value = parseFloat(val);
        return isNaN(value) ? undefined : value;
    }

    /**
     * Validates the number field value.
     * @returns {boolean} True if the value is valid, false otherwise.
     */
    validateNumber() {
        const value = this.getValue();
        if (!value && !this.isRequired()) {
            return true;
        }
        if (!validateNumber(value)) {
            this.validator?.setError(html`<i18n-text key="forms.fields.number.errNumber"></i18n-text>`);
            return false;
        }
        const min = this.getProperty('min');
        if (value && min && value < min) {
            this.validator?.setError(html`<i18n-text key="forms.fields.number.errMin" replacements="min::${min}"></i18n-text>`);
            return false;
        }
        const max = this.getProperty('max');
        if (value && max && value > max) {
            this.validator?.setError(html`<i18n-text key="forms.fields.number.errMax" replacements="max::${max}"></i18n-text>`);
            return false;
        }
        const step = this.getProperty('step');
        if (value && step && value % step !== 0) {
            this.validator?.setError(
                html`<i18n-text key="forms.fields.number.errStep" replacements="step::${step}"></i18n-text>`
            );
            return false;
        }
        return true;
    }
}

defineCustomElement(NumberField.prototype.getTagName(), NumberField);

export default NumberField;
