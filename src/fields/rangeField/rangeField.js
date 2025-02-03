/** @typedef {import('./rangeField.types').RangeFieldConfigType} RangeFieldConfigType */
import { mergeObjects } from '@arpadroid/tools';
import Field from '../field/field.js';
const html = String.raw;
class RangeField extends Field {
    /**
     * Returns default config.
     * @returns {RangeFieldConfigType}
     */
    getDefaultConfig() {
        return mergeObjects(super.getDefaultConfig(), {
            inputAttributes: { type: 'range' },
            inputTemplate: html`<input is="field-input" value="{value}" min="{min}" max="{max}" step="{step}" />`
        });
    }

    /**
     * Returns the input template variables.
     * @returns {Record<string, unknown>}
     */
    getInputTemplateVars() {
        return {
            ...super.getInputTemplateVars(),
            min: this.getProperty('min'),
            max: this.getProperty('max'),
            step: this.getProperty('step'),
            value: this.getValue()
        };
    }

    getFieldType() {
        return 'range';
    }

    getTagName() {
        return 'range-field';
    }

    getValue() {
        const val = /** @type {string} */ (super.getValue());
        return parseFloat(val);
    }
}

customElements.define(RangeField.prototype.getTagName(), RangeField);

export default RangeField;
