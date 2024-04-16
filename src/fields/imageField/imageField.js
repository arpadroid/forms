/**
 * @typedef {import('./imageFieldInterface.js').ImageFieldInterface} ImageFieldInterface
 */
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

    addUpload(file) {
        return this.uploadList?.addItem({ file });
    }

    _getI18n() {
        const i18n = super._getI18n();
        const fileI18n = I18n.get('modules.form.fields.file', false);
        return mergeObjects(fileI18n, i18n);
    }

    onSubmitSuccess() {
        super.onSubmitSuccess();
        // /** @type {ImageFieldInput} */
        // const inputComponent = this.getInputComponent();
        // inputComponent.removeUploads();
    }
}

customElements.define('image-field', ImageField);

export default ImageField;
