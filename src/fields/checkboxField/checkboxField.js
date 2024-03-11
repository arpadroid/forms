import { mergeObjects, processTemplate } from '@arpadroid/tools';
import Field from '../field/field.js';
const html = String.raw;

/**
 * @typedef {import('../field/fieldInterface.js').FieldInterface} FieldInterface
 */

/**
 * The template for the checkbox field.
 * @type {string}
 */
export const FieldTemplate = html`
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
 * Represents a checkbox field.
 */
class CheckboxField extends Field {
    /**
     * Get the default configuration for the checkbox field.
     * @returns {FieldInterface} The default configuration object.
     */
    getDefaultConfig() {
        return mergeObjects(super.getDefaultConfig(), {
            template: FieldTemplate,
            inputAttributes: { type: 'checkbox' }
        });
    }

    /**
     * Render the template for the checkbox field.
     * @returns {string | undefined} The rendered template.
     */
    renderTemplate() {
        const { template, inputTemplate } = this._config;
        if (template) {
            return processTemplate(template, {
                input: inputTemplate,
                tooltip: this.getTooltip(),
                icon: this.getProperty('icon'),
                iconRight: this.getProperty('icon-right')
            });
        }
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
