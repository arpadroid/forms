/**
 * @typedef {import('../field/fieldInterface.js').FieldInterface} FieldInterface
 */
import { mergeObjects } from '@arpadroid/tools';
import Field from '../field/field.js';
const html = String.raw;

/**
 * @module CheckboxField
 */
class CheckboxField extends Field {
    static template = html`
        <label is="field-label" class="fieldInput">
            <arpa-icon class="arpaField__icon">{icon}</arpa-icon>
            <span class="fieldLabel__text"></span>
            <arpa-icon class="arpaField__iconRight">{iconRight}</arpa-icon>
            <field-errors></field-errors>
            <arpa-tooltip position="left">{tooltip}</arpa-tooltip>
            {input}
        </label>
        <p is="field-description"></p>
    `;

    /**
     * Returns the default configuration for the checkbox field.
     * @returns {FieldInterface}
     */
    getDefaultConfig() {
        return mergeObjects(super.getDefaultConfig(), {
            template: CheckboxField.template,
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
        return this?.input?.checked ?? super.getValue();
    }

    /**
     * Validates the checkbox field is checked.
     * @returns {boolean}
     */
    validateRequired() {
        if (!this.isRequired()) {
            return true;
        }
        if (!this.input?.checked) {
            const message = this.i18n.errRequired;
            this.setError(message);
        }
        return this.input?.checked;
    }
}

customElements.define(CheckboxField.prototype.getTagName(), CheckboxField);

export default CheckboxField;
