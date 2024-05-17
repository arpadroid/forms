import Field from '../../field.js';
import { attr } from '@arpadroid/tools';
class FieldInput extends HTMLInputElement {

    constructor() {
        super();
        this._onFocus = this._onFocus.bind(this);
        this._onInput = this._onInput.bind(this);
    }

    setValue(value) {
        this.setAttribute('value', value);
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
        }

        this.classList.add('fieldInput');
        if (this.field?.isDisabled()) {
            this.setAttribute('disabled', '');
        }
        attr(this, {
            placeholder: this.field?.getPlaceholder()
        });
        this.initializeListeners();
    }

    initializeListeners() {
        this.removeEventListener('focus', this._onFocus);
        this.addEventListener('focus', this._onFocus);
        this.removeEventListener('input', this._onInput);
        this.addEventListener('input', this._onInput);
    }

    _onInput(event) {
        this.field._callOnChange(event);
    }

    _onFocus() {
        this.field?._onFocus();
    }


    update() {}
}

customElements.define('field-input', FieldInput, { extends: 'input' });

export default FieldInput;
