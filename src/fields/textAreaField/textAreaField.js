import { attr } from '@arpadroid/tools';
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

    _initialize() {
        this.value = this.innerHTML || this.getProperty('value');
        super._initialize();
    }

    _initializeInputNode() {
        super._initializeInputNode(this.querySelector('textarea'));
        attr(this.input, {
            rows: this.getProperty('rows')
        });
    }
}

customElements.define('text-area-field', TextAreaField);

export default TextAreaField;
