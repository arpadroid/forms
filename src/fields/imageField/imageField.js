/** @typedef {import('./imageFieldInterface.js').ImageFieldInterface} ImageFieldInterface */
import { I18n } from '@arpadroid/i18n';
import { mergeObjects } from '@arpadroid/tools';
import FileField from '../fileField/fileField.js';

class ImageField extends FileField {
    /**
     * Returns default config for image field.
     * @returns {ImageFieldInterface}
     */
    getDefaultConfig() {
        return mergeObjects(super.getDefaultConfig(), {
            className: 'imageField',
            listComponent: 'image-list',
            uploadListComponent: 'image-list',
            fileComponent: 'image-item',
            extensions: ['jpg', 'png', 'gif', 'jpeg', 'svg']
        });
    }

    getFieldType() {
        return 'image';
    }

    getTagName() {
        return 'image-field';
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

customElements.define(ImageField.prototype.getTagName(), ImageField);

export default ImageField;
