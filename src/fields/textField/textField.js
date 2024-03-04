import Field from '../field/field.js';

class TextField extends Field {
    constructor(config) {
        super(config);
    }

    connectedCallback() {
        super.connectedCallback();
    }
}

customElements.define('text-field', TextField);

export default TextField;
