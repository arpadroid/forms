const html = String.raw;
class FieldLabel extends HTMLLabelElement {
    connectedCallback() {
        this.field = this.closest('.arpaField');
        this.render();
    }

    render() {
        const label = this.getLabel();
        if (label) {
            this.setAttribute('for', this.field.getHtmlId());
            this.classList.add('fieldLabel');
            this.innerHTML = html` <span class="fieldLabel__text">${label}</span>${this.renderRequired()}`;
        } else {
            this.remove();
        }
    }

    renderRequired() {
        const required = this.field.hasAttribute('required');
        if (required) {
            return html`<span class="fieldLabel__required">*</span>`;
        }
        return '';
    }

    getLabel() {
        return this.field.getAttribute('label');
    }
}

customElements.define('field-label', FieldLabel, { extends: 'label' });

export default FieldLabel;
