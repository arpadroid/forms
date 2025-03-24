/** @typedef {import('./textArea.types').TextAreaConfigType} TextAreaConfigType */
import { attr, defineCustomElement } from '@arpadroid/tools';
import TextField from '../textField/textField.js';
const html = String.raw;
class TextAreaField extends TextField {
    /** @type {HTMLTextAreaElement} */
    input = this.input;
    /**
     * Returns the default configuration for the text area field.
     * @returns {TextAreaConfigType} The default configuration.
     */
    getDefaultConfig() {
        this.bind('_onInput');
        return {
            ...super.getDefaultConfig(),
            rows: 6,
            inputTemplate: html`<textarea id="{id}" class="fieldInput"></textarea>`,
            inputTag: 'textarea'
        };
    }

    getFieldType() {
        return 'textarea';
    }

    getTagName() {
        return 'textarea-field';
    }

    async _initialize() {
        this.value = this.innerHTML || this.getProperty('value');
        super._initialize();
    }

    async _initializeInputNode() {
        await super._initializeInputNode();
        this.input = /** @type {HTMLTextAreaElement} */ (this.getInput());
        
        if (this.input) {
            
            attr(this.input, { rows: this.getProperty('rows') });
            this.input?.removeEventListener('input', this._onInput);
            this.input?.addEventListener('input', this._onInput);
        }
        return true;
    }

    /**
     * Handles the input event.
     * @param {Event} event
     */
    _onInput(event) {
        this._callOnChange(event);
    }
}

defineCustomElement(TextAreaField.prototype.getTagName(), TextAreaField);

export default TextAreaField;
