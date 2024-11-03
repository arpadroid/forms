import { mergeObjects, removeLastSlash } from '@arpadroid/tools';
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

    getTagName() {
        return 'url-field';
    }

    getI18nKey() {
        return 'forms.fields.url';
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
            this.setError(html`<i18n-text key="${this.getI18nKey()}.errUrl"></i18n-text>`);
        }
        return isValid;
    }
}

customElements.define(UrlField.prototype.getTagName(), UrlField);

export default UrlField;
