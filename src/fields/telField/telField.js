import { mergeObjects } from '@arpadroid/tools';
import TextField from '../textField/textField.js';

class TelField extends TextField {
    getDefaultConfig() {
        return mergeObjects(super.getDefaultConfig(), {
            icon: 'phone',
            regex: 'telephone',
            regexMessage: 'Invalid phone number',
            inputAttributes: {
                type: 'text'
            }
        });
    }
}

customElements.define('tel-field', TelField);

export default TelField;
