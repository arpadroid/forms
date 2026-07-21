import { I18n } from '@arpadroid/i18n';
import TextField from '../textField/textField.js';
import { defineCustomElement } from '@arpadroid/tools';
/** @typedef {import('../field/field.types').FieldConfigType} FieldConfigType */

class EmailField extends TextField {
    /**
     * Returns the default configuration for the email field, extending the base field configuration with email-specific settings.
     * @returns {FieldConfigType}
     */
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
}

defineCustomElement('email-field', EmailField);

export default EmailField;
