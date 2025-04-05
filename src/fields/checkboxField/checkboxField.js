/**
 * @typedef {import('./checkboxField.types').CheckboxFieldConfigType} CheckboxFieldConfigType
 */
import { defineCustomElement, mergeObjects } from '@arpadroid/tools';
import Field from '../field/field.js';
const html = String.raw;

/**
 * @module CheckboxField
 */
class CheckboxField extends Field {
    /** @type {HTMLInputElement} */
    input = this.input;
    /** @type {CheckboxFieldConfigType} */
    _config = this._config;

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

    _getTemplate() {
        return html`
            <label for="${this.getHtmlId()}" class="fieldInput checkboxField__label fieldLabel buttonInput">
                <arpa-icon class="arpaField__icon">{icon}</arpa-icon>
                <span class="fieldLabel__text" zone="checkbox-label">{label}</span>
                <arpa-icon class="arpaField__iconRight">{iconRight}</arpa-icon>
                <field-errors></field-errors>
                {tooltip} {input}
            </label>
            {description}
        `;
    }

    /**
     * Returns the template variables for the checkbox field.
     * @returns {Record<string, string>} The template variables.
     */
    getTemplateVars() {
        return mergeObjects(super.getTemplateVars(), {
            tooltip: this.renderTooltip(),
            icon: this.getProperty('icon'),
            iconRight: this.getProperty('icon-right'),
            label: this.getLabel()
        });
    }

    renderTooltip() {
        return this.hasContent('tooltip')
            ? html`<arpa-tooltip position="${this.getTooltipPosition}">${this.getTooltip()}}</arpa-tooltip>`
            : '';
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

defineCustomElement(CheckboxField.prototype.getTagName(), CheckboxField);

export default CheckboxField;
