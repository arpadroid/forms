import TextField from '../textField/textField.js';

class EmailField extends TextField {
    getDefaultConfig() {
        return {
            ...super.getDefaultConfig(),
            regex: 'email',
            regexMessage: 'Invalid email',
            icon: 'email',
            inputAttributes: {
                type: 'email'
            }
        };
    }
}

customElements.define('email-field', EmailField);

export default EmailField;
