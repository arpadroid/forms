/** @typedef {import('./textAreaInterface.js').TextAreaInterface} TextAreaInterface */
import { attr } from '@arpadroid/tools';
import TextField from '../textField/textField.js';
const html = String.raw;
class TextAreaField extends TextField {

    _bindMethods() {
        super._bindMethods();
        this._onInput = this._onInput.bind(this);
    }
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

    getFieldType() {
        return 'textarea';
    }

    getTagName() {
        return 'textarea-field';
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
        this.input.removeEventListener('input', this._onInput);
        this.input.addEventListener('input', this._onInput);
    }

    _onInput(event) {
        this._callOnChange(event);
    }
}

customElements.define(TextAreaField.prototype.getTagName(), TextAreaField);

export default TextAreaField;
