import Field from '../field/field.js';
import { Regex } from '@arpadroid/tools';

/**
 * Represents a text field element.
 */
class TextField extends Field {
    /**
     * Array of validations for the text field.
     * @type {string[]}
     * @protected
     */
    _validations = [...super.getValidations(), 'regex'];

    constructor(config) {
        super(config);
        this._onInput = this._onInput.bind(this);
    }

    /**
     * Called when the element is connected to the DOM.
     * @override
     */
    _onInitialized() {
        super._onInitialized();
        this.setRegexValidation();
    }

    /**
     * Sets the regex validation for the text field.
     * @param {string | RegExp} [regex] - The regular expression or the name of a predefined regex pattern.
     * @param {string} [message] - The error message to display if the validation fails.
     */
    setRegexValidation(regex = this.getProperty('regex'), message = this.getProperty('regex-message')) {
        if (typeof regex === 'string') {
            if (Regex[regex]) {
                regex = Regex[regex];
            } else {
                // eslint-disable-next-line security/detect-non-literal-regexp
                regex = new RegExp(regex);
            }
        }

        if (regex instanceof RegExp) {
            this.regex = regex;
        }
        if (typeof message === 'string') {
            this.regexMessage = message;
        }
    }
}

customElements.define('text-field', TextField);

export default TextField;
