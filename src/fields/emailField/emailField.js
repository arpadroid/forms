import { I18n } from '@arpadroid/i18n';
import TextField from '../textField/textField.js';

class EmailField extends TextField {
    getDefaultConfig() {
        return {
            ...super.getDefaultConfig(),
            regex: 'email',
            regexMessage: I18n.getText('modules.form.fields.email.errRegex'),
            icon: 'email',
            inputAttributes: {
                type: 'email',
                autocomplete: 'email'
            }
        };
    }

    getFieldType() {
        return 'email';
    }

    getTagName() {
        return 'email-field';
    }
}

customElements.define(EmailField.prototype.getTagName(), EmailField);

export default EmailField;
