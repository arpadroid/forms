import { attr } from '@arpadroid/tools';
import Field from '../field/field.js';
import TextField from '../textField/textField.js';
const html = String.raw;
/**
 * @typedef {import('./textAreaInterface.js').TextAreaInterface} TextAreaInterface
 */

/**
 * Represents a text area field.
 */
class TextAreaField extends TextField {
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
     * Called when the element is connected to the DOM.
     */
    connectedCallback() {
        const value = this.innerHTML || this.getProperty('value');
        super.connectedCallback();
        if (value) {
            this.textarea.value = value;
        }
    }

    _initializeInputNode() {
        super._initializeInputNode(this.querySelector('textarea'));
        this.textarea = this.input;
        attr(this.input, {
            rows: this.getProperty('rows')
        });
    }
}

customElements.define('text-area-field', TextAreaField);

export default TextAreaField;
