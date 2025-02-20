import { I18n } from '@arpadroid/i18n';
import TextField from '../textField/textField.js';
import { defineCustomElement } from '@arpadroid/tools';

class EmailField extends TextField {
    getDefaultConfig() {
        return {
            ...super.getDefaultConfig(),
            regex: 'email',
            regexMessage: I18n.getText('forms.fields.email.errRegex'),
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

defineCustomElement(EmailField.prototype.getTagName(), EmailField);

export default EmailField;
