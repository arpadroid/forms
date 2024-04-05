import { mergeObjects, removeLastSlash } from '@arpadroid/tools';
import TextField from '../textField/textField.js';

class UrlField extends TextField {
    _validations = [...super.getValidations(), 'url'];
    getDefaultConfig() {
        return mergeObjects(super.getDefaultConfig(), {
            icon: 'link'
        });
    }

    validateUrl(value) {
        let isValid = true;
        if (value) {
            try {
                const url = new URL(value);
                isValid = removeLastSlash(url.href) === removeLastSlash(value);
            } catch (error) {
                isValid = false;
            }
        }
        if (!isValid) {
            this.setError('Invalid URL');
        }
        return isValid;
    }
}

customElements.define('url-field', UrlField);

export default UrlField;
