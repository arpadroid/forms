import Field from '../../field.js';

class FieldInput extends HTMLInputElement {
    static get observedAttributes() {
        return ['value'];
    }

    setValue(value) {
        this.value = value;
    }

    connectedCallback() {
        this.update();
        /** @type {Field} */
        this.field = this.closest('.arpaField');
        this.id = this.field.getHtmlId();
        this.name = this.field.id;
        this.classList.add('fieldInput');
        this.value = this.field.getAttribute('value');
    }

    update() {}
}

customElements.define('field-input', FieldInput, { extends: 'input' });

export default FieldInput;
