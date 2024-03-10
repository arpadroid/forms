/**
 * @typedef {import('../../field').default} Field
 */

const html = String.raw;
class FieldLabel extends HTMLLabelElement {
    connectedCallback() {
        /** @type {Field} */
        this.field = this.closest('.arpaField');
        this.render();
    }

    render() {
        this.content = this.innerHTML;
        const label = this.field.getLabel();
        const labelNode = this.querySelector('.fieldLabel__text');
        if (label) {
            this.setAttribute('for', this.field.getHtmlId());
            this.classList.add('fieldLabel');
            if (labelNode) {
                labelNode.innerHTML = `${label} ${this.renderRequired()}`;
            } else {
                this.innerHTML = html`
                    <span class="fieldLabel__text">${label}</span>${this.renderRequired()}
                `;
            }
        } else {
            this.remove();
        }
    }

    renderRequired() {
        const required = this.field.isRequired();
        if (required) {
            return html`<span class="fieldLabel__required">*</span>`;
        }
        return '';
    }
}

customElements.define('field-label', FieldLabel, { extends: 'label' });

export default FieldLabel;
