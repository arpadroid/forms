/**
 * @typedef {import('./fieldInput.types.js').FieldInputConfigType} FieldInputConfigType
 */
import { ArpaElement } from '@arpadroid/ui';
import Field from '../../field.js';
import { attrString, defineCustomElement, mergeObjects } from '@arpadroid/tools';
class FieldInput extends ArpaElement {
    _initialize() {
        this.bind('_onFocus', '_onInput');
        /** @type {Record<string, unknown>} */
        this.inputAttributes = {};
        for (const attr of this.attributes) {
            this.inputAttributes[attr.name] = attr.value;
            this.removeAttribute(attr.name);
        }
    }

    /**
     * Returns the default configuration for the field input.
     * @returns {FieldInputConfigType}
     */
    getDefaultConfig() {
        return {
            inputAttributes: {},
            inputClass: 'fieldInput'
        };
    }

    /**
     * Sets the value of the input element.
     * @param {string} value
     */
    setValue(value) {
        this.input && (this.input.value = value);
        this.input?.setAttribute('value', value);
    }

    /**
     * Called when the element is ready.
     * @returns {Promise<any>}
     */
    async onReady() {
        return customElements.whenDefined('arpa-field');
    }

    _preRender() {
        if (!this.field) {
            /** @type {Field | null} */
            this.field = this.closest('.arpaField');
        }
    }

    _getTemplate() {
        const attr = mergeObjects(this.inputAttributes, {
            class: this.getProperty('input-class'),
            id: this.field?.getHtmlId(),
            name: this.field?.getId(),
            disabled: this.field?.isDisabled(),
            placeholder: this.field?.getPlaceholder(),
            value: this.field?.getValue()?.toString(),
        });

        return `<input ${attrString(attr)} />`;
    }

    async _initializeNodes() {
        /** @type {HTMLInputElement | null} */
        this.input = this.querySelector('input');
        this.initializeListeners();
        return true;
    }

    initializeListeners() {
        this.input?.removeEventListener('focus', this._onFocus);
        this.input?.addEventListener('focus', this._onFocus);
        this.input?.removeEventListener('input', this._onInput);
        this.input?.addEventListener('input', this._onInput);
    }

    /**
     * Handles the input event for the input element.
     * @param {Event} event
     */
    _onInput(event) {
        this.field?._callOnChange(event);
    }

    _onFocus() {
        this.field?._onFocus();
    }
}

defineCustomElement('field-input', FieldInput);

export default FieldInput;
