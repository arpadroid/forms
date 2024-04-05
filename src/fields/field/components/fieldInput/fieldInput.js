import Field from '../../field.js';

class FieldInput extends HTMLInputElement {
    static get observedAttributes() {
        return ['value'];
    }

    setValue(value) {
        this.value = value;
    }

    attributeChangedCallback() {
        //abstract
    }

    onReady() {
        return customElements.whenDefined('arpa-field');
    }

    async connectedCallback() {
        this.update();
        /** @type {Field} */
        if (!this.field) {
            this.field = this.closest('.arpaField');
        }
        if (this.field) {
            this.id = this.field.getHtmlId();
            this.name = this.field.getId();
            this.value = this.field.getAttribute('value');
        }

        this.classList.add('fieldInput');
    }

    update() {}
}

customElements.define('field-input', FieldInput, { extends: 'input' });

export default FieldInput;
