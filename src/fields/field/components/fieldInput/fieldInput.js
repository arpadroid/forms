import Field from '../../field.js';
import { attr } from '@arpadroid/tools';
class FieldInput extends HTMLInputElement {
    constructor() {
        super();
        this._onFocus = this._onFocus.bind(this);
        this._onInput = this._onInput.bind(this);
        this.classList.add('fieldInput');
    }

    setValue(value) {
        this.value = value;
        this.setAttribute('value', value);
    }

    onReady() {
        return customElements.whenDefined('arpa-field');
    }

    async connectedCallback() {
        this.update();
        if (!this.field) {
            /** @type {Field} */
            this.field = this.closest('.arpaField');
        }
        await this.field?.promise;
        /**
         * @todo - When the field is not found, the field is not initialized.
         * This is failing without this check in the form component tests.
         * Ideally the field should be initialized in the form component tests.
         */
        if (typeof this.field?.getHtmlId === 'function') {
            this.id = this.field?.getHtmlId();
            this.name = this.field.getId();
            attr(this, {
                disabled: this.field?.isDisabled(),
                placeholder: this.field?.getPlaceholder()
            });
        } else {
            console.error('Field not found for input', this);
        }

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
