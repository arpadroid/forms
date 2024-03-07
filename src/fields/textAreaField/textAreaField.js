import { attr } from '@arpadroid/tools';
import Field from '../field/field.js';
const html = String.raw;
class TextAreaField extends Field {
    getDefaultConfig() {
        return {
            ...super.getDefaultConfig(),
            rows: 6,
            inputTemplate: html`<textarea class="fieldInput"></textarea>`
        };
    }

    _initializeInput() {
        this.input = this.querySelector('textarea');   
    }

    connectedCallback() {
        const value = this.innerHTML;
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
