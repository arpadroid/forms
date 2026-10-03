import Field from '../field/field.js';
import { defineCustomElement, RegexTool } from '@arpadroid/tools';

class TextField extends Field {
    _validations = [...super.getValidations(), 'regex'];

    $onInitialized() {
        super.$onInitialized();
        this.setRegexValidation();
    }

    getFieldType() {
        return 'text';
    }

    /**
     * Sets the regex validation for the text field.
     * @param {string | RegExp} [regex] - The regular expression or the name of a predefined regex pattern.
     * @param {string} [message] - The error message to display if the validation fails.
     */
    setRegexValidation(regex = this.getProp('regex'), message = this.getProp('regex-message')) {
        if (typeof regex === 'string') {
            regex = RegexTool[regex] || new RegExp(regex);
        }

        if (regex instanceof RegExp) {
            this.regex = regex;
        }
        if (typeof message === 'string') {
            this.regexMessage = message;
        }
    }
}

defineCustomElement('text-field', TextField);

export default TextField;
