/** @typedef {import('./rangeFieldInterface.d.ts').RangeFieldInterface} RangeFieldInterface */
import { mergeObjects } from '@arpadroid/tools';
import Field from '../field/field.js';
const html = String.raw;
class RangeField extends Field {
    /**
     * Returns default config.
     * @returns {RangeFieldInterface}
     */
    getDefaultConfig() {
        return mergeObjects(super.getDefaultConfig(), {
            inputAttributes: { type: 'range' },
            inputTemplate: html`<input is="field-input" value="{value}" min="{min}" max="{max}" step="{step}" />`
        });
    }

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
        return parseFloat(super.getValue());
    }
}

customElements.define(RangeField.prototype.getTagName(), RangeField);

export default RangeField;
