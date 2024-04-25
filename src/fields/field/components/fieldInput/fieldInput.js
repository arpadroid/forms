import Field from '../../field.js';
import { attr } from '@arpadroid/tools';
class FieldInput extends HTMLInputElement {
    constructor() {
        super();
        this._onFocus = this._onFocus.bind(this);
    }

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

    connectedCallback() {
        this.update();
        if (!this.field) {
            /** @type {Field} */
            this.field = this.closest('.arpaField');
        }
        if (this.field) {
            this.id = this.field.getHtmlId();
            this.name = this.field.getId();
            this.value = this.field.getAttribute('value');
        }

        this.classList.add('fieldInput');
        if (this.field.isDisabled()) {
            this.setAttribute('disabled', '');
        }
        attr(this, {
            placeholder: this.field.getPlaceholder()
        });
        this.removeEventListener('focus', this._onFocus);
        this.addEventListener('focus', this._onFocus);
        // const type = this.getAttribute('type');
        // console.log('type', type);
        // this.setAttribute('inputmode', 'numeric');
    }

    _onFocus() {
        this.field?._onFocus();
    }

    update() {}
}

customElements.define('field-input', FieldInput, { extends: 'input' });

export default FieldInput;
