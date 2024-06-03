import { render } from '@arpadroid/tools';
/**
 * @typedef {import('../../field').Field} Field
 */
const html = String.raw;
/**
 * Represents a custom HTML element for an field input mask.
 */
class FieldInputMask extends HTMLElement {
    rhs = {};
    lhs = {};

    addRhs(id, node) {
        if (typeof id === 'string' && node instanceof HTMLElement) {
            this.rhs[id] = node;
        }
        if (node instanceof HTMLElement && this.rhsNode) {
            this.rhsNode.append(node);
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
        if (node instanceof HTMLElement && this.lhsNode) {
            this.lhsNode.append(node);
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

        this.innerHTML = html`
            <div class="fieldInputMask__lhs">${this.renderIconLeft()}</div>
            <div class="fieldInputMask__rhs">${this.renderIconRight()}</div>
        `;

        this.rhsNode = this.querySelector('.fieldInputMask__rhs');
        this.rhsNode?.append(...this.getRhsNodes());
        this.lhsNode = this.querySelector('.fieldInputMask__lhs');
        this.lhsNode?.append(...this.getLhsNodes());
        this.icon = this.querySelector('.arpaField__icon');
        this.iconRight = this.querySelector('.arpaField__iconRight');
    }

    renderIconLeft() {
        const icon = this.field?.getIcon();
        const fieldId = this.field?.getHtmlId();
        return render(icon, html`<label for="${fieldId}"><arpa-icon class="arpaField__icon">${icon}</arpa-icon></label>`);
    }

    renderIconRight() {
        const iconRight = this.field?.getIconRight();
        const fieldId = this.field?.getHtmlId();
        return render(
            iconRight,
            html`<label for="${fieldId}"><arpa-icon class="arpaField__iconRight">${iconRight}</arpa-icon></label>`
        );
    }
}

customElements.define('field-input-mask', FieldInputMask);

export default FieldInputMask;
