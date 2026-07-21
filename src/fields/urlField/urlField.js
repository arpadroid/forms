import { defineCustomElement, mergeObjects, removeLastSlash } from '@arpadroid/tools';
import TextField from '../textField/textField.js';
const html = String.raw;
class UrlField extends TextField {
    _validations = [...super.getValidations(), 'url'];
    getDefaultConfig() {
        return mergeObjects(super.getDefaultConfig(), {
            icon: 'link'
        });
    }

    getFieldType() {
        return 'url';
    }

    getI18nKey() {
        return 'forms.fields.url';
    }

    /**
     * Validates the URL value.
     * @param {string} value - The value to validate.
     * @returns {boolean} True if the value is a valid URL.
     */
    validateUrl(value) {
        let isValid = true;
        if (value) {
            try {
                const url = new URL(value);
                isValid = removeLastSlash(url.href) === removeLastSlash(value);
            } catch (error) {
                console.error('Invalid URL:', error);
                isValid = false;
            }
        }
        if (!isValid) {
            this.setError(html`<i18n-text key="${this.getI18nKey()}.errUrl"></i18n-text>`);
        }
        return isValid;
    }
}

defineCustomElement('url-field', UrlField);

export default UrlField;
