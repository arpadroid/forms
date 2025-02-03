/**
 * @typedef {import('./checkboxField.types').CheckboxFieldConfigType} CheckboxFieldConfigType
 */
import { mergeObjects } from '@arpadroid/tools';
import Field from '../field/field.js';
const html = String.raw;

/**
 * @module CheckboxField
 */
class CheckboxField extends Field {
    /** @type {HTMLInputElement} */// @ts-ignore
    input = this.input;
    /** @type {CheckboxFieldConfigType} */// @ts-ignore
    _config = this._config;

    static template = html`
        <label is="field-label" class="fieldInput checkboxField__label">
            <arpa-icon class="arpaField__icon">{icon}</arpa-icon>
            <span class="fieldLabel__text" zone="checkbox-label"></span>
            <arpa-icon class="arpaField__iconRight">{iconRight}</arpa-icon>
            <field-errors></field-errors>
            <arpa-tooltip position="left">{tooltip}</arpa-tooltip>
            {input}
        </label>
        <p is="field-description"></p>
    `;

    /**
     * Returns the default configuration for the checkbox field.
     * @returns {CheckboxFieldConfigType}
     */
    getDefaultConfig() {
        return mergeObjects(super.getDefaultConfig(), {
            template: CheckboxField.template,
            className: 'checkboxField',
            inputAttributes: { type: 'checkbox' }
        });
    }

    getFieldType() {
        return 'checkbox';
    }

    getTagName() {
        return 'checkbox-field';
    }

    /**
     * Returns the template variables for the checkbox field.
     * @returns {Record<string, string>} The template variables.
     */
    getTemplateVars() {
        return mergeObjects(super.getTemplateVars(), {
            tooltip: this.getTooltip(),
            icon: this.getProperty('icon'),
            iconRight: this.getProperty('icon-right'),
            label: this.getLabel()
        });
    }

    /**
     * Returns the value for the checkbox.
     * @returns {boolean}
     */
    getValue() {
        return Boolean(this?.input?.checked ?? super.getValue());
    }

    /**
     * Validates the checkbox field is checked.
     * @returns {boolean}
     */
    validateRequired() {
        if (!this.isRequired()) {
            return true;
        }
        !this.input?.checked && this.setError(this.i18n('errRequired'));
        return Boolean(this.input?.checked);
    }
}

customElements.define(CheckboxField.prototype.getTagName(), CheckboxField);

export default CheckboxField;
