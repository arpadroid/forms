/**
 * @typedef {import('./numberField.types').NumberFieldConfigType} NumberFieldConfigType
 * @typedef {import('../field/field.types.js').FieldConfigType} FieldConfigType
 * @typedef {import('../field/field.types.js').PreProcessValueType<number | string>} PreProcessValueType
 */
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
        this.bind('enforceValidValue');
        return {
            ...super.getDefaultConfig(),
            icon: 'numbers',
            inputAttributes: {
                type: 'number',
                min: this.getProp('min'),
                max: this.getProp('max'),
                step: this.getProp('step')
            }
        };
    }

    getOutputValue() {
        const enforceValue = this.hasProp('enforce-value') || false;
        const val = Number(super.getOutputValue());
        if (enforceValue && val) {
            const rv = this.enforceValidValue(val);
            this.setValue(rv, false);
            return rv;
        }
        return val;
    }

    /**
     * Sets the minimum value for the number field.
     * @param {number} value - The minimum value.
     */
    setMin(value) {
        this.setAttribute('min', value.toString());
        this.input?.setAttribute('min', value.toString());
    }

    getMin() {
        return parseFloat(this.getProp('min'));
    }

    getMax() {
        return parseFloat(this.getProp('max')) || undefined;
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
     * Pre-processes the number field value.
     * @type {PreProcessValueType}
     */
    enforceValidValue(value) {
        const val = parseFloat(String(value));
        const max = this.getMax();
        const min = this.getMin();
        if (typeof max !== 'undefined' && val > max) {
            return max;
        }
        if (typeof min !== 'undefined' && val < min) {
            return min;
        }
        return value;
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
        const min = this.getProp('min');
        if (value && min && value < min) {
            this.validator?.setError(html`<i18n-text key="forms.fields.number.errMin" replacements="min::${min}"></i18n-text>`);
            return false;
        }
        const max = this.getProp('max');
        if (value && max && value > max) {
            this.validator?.setError(html`<i18n-text key="forms.fields.number.errMax" replacements="max::${max}"></i18n-text>`);
            return false;
        }
        const step = this.getProp('step');
        if (value && step && value % step !== 0) {
            this.validator?.setError(
                html`<i18n-text key="forms.fields.number.errStep" replacements="step::${step}"></i18n-text>`
            );
            return false;
        }
        return true;
    }
}

defineCustomElement('number-field', NumberField);

export default NumberField;
