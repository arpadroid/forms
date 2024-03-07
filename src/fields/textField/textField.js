import Field from '../field/field.js';
import { Regex } from '@arpadroid/tools';

class TextField extends Field {
    _validations = [...super.getValidations(), 'regex'];

    connectedCallback() {
        super.connectedCallback();
        this.setRegexValidation();
    }

    setRegexValidation(regex = this.getAttribute('regex'), message = this.getAttribute('regex-message')) {
        if (typeof regex === 'string') {
            if (Regex[regex]) {
                regex = Regex[regex];
            } else {
                // eslint-disable-next-line security/detect-non-literal-regexp
                regex = new RegExp(regex);
            }
        }
        if (regex instanceof RegExp) {
            this._config.validation.regex = regex;
        }
        if (typeof message === 'string') {
            this._config.regexMessage = message;
        }
    }
}

customElements.define('text-field', TextField);

export default TextField;
