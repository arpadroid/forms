/** @typedef {import('./numberFIeldInterface.js').NumberFieldInterface} NumberFieldInterface */
import { validateNumber } from '@arpadroid/tools';
import Field from '../field/field.js';
const html = String.raw;
class NumberField extends Field {
    i18nKey = this.getI18nKey();
    _validations = [...super.getValidations(), 'number'];

    /**
     * Returns the default configuration for the number field.
     * @returns {NumberFieldInterface} The default configuration object.
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

    setMin(value) {
        this.setAttribute('min', value);
        this.input?.setAttribute('min', value);
    }

    setMax(value) {
        this.setAttribute('max', value);
        this.input?.setAttribute('max', value);
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
     * @protected
     */
    getValue() {
        const value = parseFloat(super.getValue());
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
            this.validator.setError(html`<i18n-text key="forms.fields.number.errNumber"></i18n-text>`);
            return false;
        }
        const min = this.getProperty('min');
        if (min && value < min) {
            this.validator.setError(
                html`<i18n-text key="forms.fields.number.errMin" replacements="min::${min}"></i18n-text>`
            );
            return false;
        }
        const max = this.getProperty('max');
        if (max && value > max) {
            this.validator.setError(
                html`<i18n-text key="forms.fields.number.errMax" replacements="max::${max}"></i18n-text>`
            );
            return false;
        }
        const step = this.getProperty('step');
        if (step && value % step !== 0) {
            this.validator.setError(
                html`<i18n-text key="forms.fields.number.errStep" replacements="step::${step}"></i18n-text>`
            );
            return false;
        }
        return true;
    }
}

customElements.define(NumberField.prototype.getTagName(), NumberField);

export default NumberField;
