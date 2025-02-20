import { render, appendNodes, defineCustomElement } from '@arpadroid/tools';
/**
 * @typedef {import('../../field.js').default} Field
 */
const html = String.raw;
/**
 * Represents a custom HTML element for an field input mask.
 */
class FieldInputMask extends HTMLElement {
    /** @type {Record<string, HTMLElement>} */
    rhs = {};
    /** @type {Record<string, HTMLElement>} */
    lhs = {};

    /**
     * Adds a node to the right-hand side of the field input mask.
     * @param {string} id - The id of the node.
     * @param {HTMLElement} node - The node to add.
     */
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

    /**
     * Adds a node to the left-hand side of the field input mask.
     * @param {string} id - The id of the node.
     * @param {HTMLElement} node - The node to add.
     */
    addLhs(id, node) {
        if (typeof id === 'string' && node instanceof HTMLElement) {
            this.lhs[id] = node;
        }
        if (node instanceof HTMLElement && this.lhsNode) {
            this.lhsNode.append(node);
        }
    }

    getLhsNodes() {
        return Object.values(this.lhs);
    }

    async connectedCallback() {
        // await this.onReady();
        /** @type {Field} */
        this.field = /** @type {Field} */ (this.closest('.arpaField'));
        this.render();
        this.update();
    }

    onReady() {
        return Promise.all([customElements.whenDefined('arpa-field')]);
    }

    update() {
        const icon = this.field?.getIcon();
        if (typeof icon === 'string' && this.icon instanceof HTMLElement) {
            this.icon.innerHTML = icon;
        }

        const iconRight = this.field?.getIconRight();
        if (typeof iconRight === 'string' && this.iconRight instanceof HTMLElement) {
            this.iconRight.innerHTML = iconRight;
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
        this.rhsNode && appendNodes(this.rhsNode, this.getRhsNodes());
        this.lhsNode = this.querySelector('.fieldInputMask__lhs');
        this.lhsNode && appendNodes(this.lhsNode, this.getLhsNodes());
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

defineCustomElement('field-input-mask', FieldInputMask);

export default FieldInputMask;
