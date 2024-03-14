import { processTemplate } from '@arpadroid/tools';
/**
 * @typedef {import('../../field').Field} Field
 */
const html = String.raw;
/**
 * Represents a custom HTML element for an field input mask.
 */
class FieldInputMask extends HTMLElement {
    /**
     * The HTML template for the field input mask.
     * @type {HTMLTemplateElement}
     */
    template = html`
        <div class="fieldInputMask__lhs">
            <label for="{fieldId}" aria-label="{icon}">
                <arpa-icon class="arpaField__icon">{icon}</arpa-icon>
            </label>
        </div>
        <div class="fieldInputMask__rhs">
            <label for="{fieldId}" aria-label="{iconRight}">
                <arpa-icon class="arpaField__iconRight">{iconRight}</arpa-icon>
            </label>
        </div>
    `;

    connectedCallback() {
        /** @type {Field} */
        this.render();
        this.field = this.closest('.arpaField');
        this.rhs = this.querySelector('.fieldInputMask__rhs');
        this.lhs = this.querySelector('.fieldInputMask__lhs');
    }

    /**
     * Retrieves the icon for the field.
     * @returns {string} The icon for the field.
     */
    getIcon() {
        return this.field?.getIcon();
    }

    /**
     * Retrieves the right icon for the field.
     * @returns {string} The right icon for the field.
     */
    getIconRight() {
        return this.field?.getIconRight();
    }

    /**
     * Renders the field input mask.
     */
    render() {
        const icon = this.getIcon();
        const iconRight = this.getIconRight();
        this.innerHTML = processTemplate(this.template, {
            icon,
            iconRight,
            fieldId: this.field?.getHtmlId()
        });
    }
}

customElements.define('field-input-mask', FieldInputMask);

export default FieldInputMask;
