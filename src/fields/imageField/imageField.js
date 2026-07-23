/** @typedef {import('./imageField.types').ImageFieldConfigType} ImageFieldConfigType */
import { I18n } from '@arpadroid/i18n';
import { defineCustomElement, mergeObjects } from '@arpadroid/tools';
import FileField from '../fileField/fileField.js';

class ImageField extends FileField {
    /** @type {ImageFieldConfigType} */
    _config = this._config;

    /**
     * Returns default config for image field.
     * @returns {ImageFieldConfigType}
     */
    getDefaultConfig() {
        const superConfig = super.getDefaultConfig();
        /** @type {ImageFieldConfigType} */
        const conf = {
            className: 'imageField',
            listComponent: 'image-list',
            uploadListComponent: 'image-list',
            fileComponent: 'image-item',
            extensions: ['jpg', 'png', 'gif', 'jpeg', 'svg']
        };
        return mergeObjects(superConfig, conf);
    }

    getFieldType() {
        return 'image';
    }

    getI18nKey() {
        return 'forms.fields.image';
    }

    _getI18n() {
        const i18n = super._getI18n();
        const fileI18n = I18n.get(this.getI18nKey(), false);
        return mergeObjects(fileI18n, i18n);
    }
}

defineCustomElement('image-field', ImageField);

export default ImageField;
