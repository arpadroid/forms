import { mergeObjects } from '@arpadroid/tools';
import Field from '../field/field.js';
const html = String.raw;

/**
 * @typedef {import('../field/fieldInterface.js').FieldInterface} FieldInterface
 */

/**
 * Represents a checkbox field.
 */
class CheckboxField extends Field {
    /**
     * The template for the checkbox field.
     * @type {string}
     */
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
     * Get the default configuration for the checkbox field.
     * @returns {FieldInterface} The default configuration object.
     */
    getDefaultConfig() {
        return mergeObjects(super.getDefaultConfig(), {
            template: CheckboxField.template,
            inputAttributes: { type: 'checkbox' }
        });
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
     * @protected
     */
    getValue() {
        return this?.input?.checked ?? super.getValue();
    }
}

customElements.define('checkbox-field', CheckboxField);

export default CheckboxField;
