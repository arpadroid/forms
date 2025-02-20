import { defineCustomElement, mergeObjects } from '@arpadroid/tools';
import TextField from '../textField/textField.js';
import { I18n } from '@arpadroid/i18n';

class TelField extends TextField {
    getDefaultConfig() {
        return mergeObjects(super.getDefaultConfig(), {
            icon: 'phone',
            regex: 'telephone',
            regexMessage: I18n.getText('forms.fields.tel.errRegex'),
            inputAttributes: {
                type: 'text'
            }
        });
    }

    getFieldType() {
        return 'tel';
    }

    getTagName() {
        return 'tel-field';
    }
}

defineCustomElement(TelField.prototype.getTagName(), TelField);

export default TelField;
