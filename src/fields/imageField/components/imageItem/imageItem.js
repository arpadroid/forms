/** @typedef {import('./imageItem.types').ImageItemConfigType} ImageItemConfigType */

import FileItem from '../../../fileField/components/fileItem/fileItem.js';
import { defineCustomElement, mergeObjects } from '@arpadroid/tools';
const html = String.raw;
class ImageItem extends FileItem {
    /** @type {ImageItemConfigType} */
    _config = this._config;
    /**
     * Returns the default config for the file item.
     * @returns {ImageItemConfigType}
     */
    getDefaultConfig() {
        const parentConfig = super.getDefaultConfig();
        this.i18nKey = 'forms.fields.image.item';
        /** @type {ImageItemConfigType} */
        const config = {
            icon: '',
            hasIcon: false,
            classNames: ['imageItem'],
            defaultImageSize: 'thumbnail',
            imagePreview: true
        };
        return mergeObjects(parentConfig, config);
    }

    _preRender() {
        super._preRender();
        const payload = this.getPayload();
        const name = String(payload.name || '');
        this._config.imagePreviewTitle = this._config.imagePreviewTitle ?? name;
    }

    _initializeFile() {
        super._initializeFile();
        const src = this.getProp('src');
        if (typeof src === 'string') {
            this._config.image = src;
            this._config.highResImage = src;
        }
        if (this._config.file) {
            this._config.image = URL.createObjectURL(this._config.file);
            this._config.highResImage = this._config.image;
        }
    }

    $renderTemplate() {
        return html`
            ${super.$renderTemplate()}
            <arpa-zone name="rhs">
                <icon-button
                    on-click="{$onPreviewClick}"
                    class="imageItem__previewButtonRhs"
                    icon="visibility"
                    tooltip="{i18n:lblPreview}"
                ></icon-button>
            </arpa-zone>
        `;
    }

    $onPreviewClick() {
        /** @type {HTMLButtonElement | null} */
        const button = this.querySelector('.image__previewButton');
        button?.click();
    }

    $onEdit() {
        // GalleryDialog.openEditor(items);
    }
}

defineCustomElement('image-item', ImageItem);

export default ImageItem;
