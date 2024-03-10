import { attr } from '@arpadroid/tools';
import Field from '../field/field.js';
const html = String.raw;
/**
 * @typedef {import('./textAreaInterface.js').TextAreaInterface} TextAreaInterface
 */

/**
 * Represents a text area field.
 */
class TextAreaField extends Field {
    /**
     * Returns the default configuration for the text area field.
     * @returns {TextAreaInterface} The default configuration.
     */
    getDefaultConfig() {
        return {
            ...super.getDefaultConfig(),
            rows: 6,
            inputTemplate: html`<textarea class="fieldInput"></textarea>`
        };
    }

    /**
     * Initializes the input element for the text area field.
     */
    initializeInput() {
        this.input = this.querySelector('textarea');   
    }

    /**
     * Called when the element is connected to the DOM.
     */
    connectedCallback() {
        const value = this.innerHTML || this.getProperty('value');
        super.connectedCallback();
        this.textarea = this.querySelector('textarea');
        attr(this.textarea, {
            rows: this.getProperty('rows'),
            id: this.getHtmlId(),
            name: this.id
        });
        if (value) {
            this.textarea.value = value;
        }
    }
}

customElements.define('text-area-field', TextAreaField);

export default TextAreaField;
