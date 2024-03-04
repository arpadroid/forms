import Field from '../../field.js';

class FieldInput extends HTMLInputElement {
    static get observedAttributes() {
        return ['value'];
    }

    connectedCallback() {
        this.update();
        /** @type {Field} */
        this.field = this.closest('.arpaField');
        this.id = this.field.getHtmlId();
        this.name = this.field.id;
        this.classList.add('fieldInput');
    }

    update() {}
}

customElements.define('field-input', FieldInput, { extends: 'input' });

export default FieldInput;
