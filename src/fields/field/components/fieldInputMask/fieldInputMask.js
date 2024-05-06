import { I18nTool } from '@arpadroid/i18n';
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

    rhs = {};
    lhs = {};

    addRhs(id, node) {
        if (typeof id === 'string' && node instanceof HTMLElement) {
            this.rhs[id] = node;
        }
    }

    getRhsNodes() {
        return Object.values(this.rhs);
    }

    getLhsNodes() {
        return Object.values(this.lhs);
    }

    addLhs(id, node) {
        if (typeof id === 'string' && node instanceof HTMLElement) {
            this.lhs[id] = node;
        }
    }

    async connectedCallback() {
        // await this.onReady();
        /** @type {Field} */
        this.field = this.closest('.arpaField');
        this.render();
        this.update();
    }

    onReady() {
        return Promise.all([customElements.whenDefined('arpa-field')]);
    }

    update() {
        if (this.icon) {
            this.icon.innerHTML = this.field?.getIcon();
        }
        if (this.iconRight) {
            this.iconRight.innerHTML = this.field?.getIconRight();
        }
    }

    /**
     * Renders the field input mask.
     */
    async render() {
        await this.onReady();
        if (!this.field) {
            return;
        }
        this.innerHTML = I18nTool.processTemplate(this.template, {
            icon: this.field?.getIcon(),
            iconRight: this.field?.getIconRight(),
            fieldId: this.field?.getHtmlId()
        });
        this.rhsNode = this.querySelector('.fieldInputMask__rhs');
        this.rhsNode?.append(...this.getRhsNodes());
        this.lhsNode = this.querySelector('.fieldInputMask__lhs');
        this.lhsNode?.append(...this.getLhsNodes());
        this.icon = this.querySelector('.arpaField__icon');
        this.iconRight = this.querySelector('.arpaField__iconRight');
    }
}

customElements.define('field-input-mask', FieldInputMask);

export default FieldInputMask;
