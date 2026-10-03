import { defineCustomElement, mergeObjects } from '@arpadroid/tools';
import TextField from '../textField/textField.js';
import { I18n } from '@arpadroid/i18n';

class TelField extends TextField {
    getDefaultConfig() {
        return mergeObjects(super.getDefaultConfig(), {
            icon: 'phone',
            regex: 'telephone',
            regexMessage: I18n.getText('forms.fields.tel.errRegex'),
            inputType: 'tel'
        });
    }

    getFieldType() {
        return 'tel';
    }
}

defineCustomElement('tel-field', TelField);

export default TelField;
