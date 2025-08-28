/** @typedef {import('./imageItem.types').ImageItemConfigType} ImageItemConfigType */

import FileItem from '../../../fileField/components/fileItem/fileItem.js';
import { defineCustomElement, mergeObjects } from '@arpadroid/tools';
// import GalleryDialog from '../../../../../../gallery/components/galleryDialog/galleryDialog.js';
const html = String.raw;
class ImageItem extends FileItem {
    /** @type {ImageItemConfigType} */
    _config = this._config;
    /**
     * Returns the default config for the file item.
     * @returns {ImageItemConfigType}
     */
    getDefaultConfig() {
        this.i18nKey = 'forms.fields.image.item';
        /** @type {ImageItemConfigType} */
        const config = {
            icon: '',
            hasIcon: false,
            defaultImageSize: 'small',
            imagePreview: true,
            imagePreviewTitle: undefined
        };
        return mergeObjects(super.getDefaultConfig(), config);
    }

    _preRender() {
        super._preRender();
        const payload = this.getPayload();
        const name = String(payload.name || '');
        this._config.imagePreviewTitle = this._config.imagePreviewTitle ?? name;
    }

    async _onConnected() {
        super._onConnected();
        this.classList.add('imageItem');
    }

    _initializeFile() {
        super._initializeFile();
        const src = this.getProperty('src');
        if (typeof src === 'string') {
            this._config.image = src;
            this._config.highResImage = src;
        }
        if (this._config.file) {
            this._config.image = URL.createObjectURL(this._config.file);
            this._config.highResImage = this._config.image;
        }
    }

    getTemplateVars() {
        return {
            ...super.getTemplateVars(),
            previewButton: this.renderPreviewButton()
        };
    }

    _getTemplate() {
        const content = super._getTemplate();
        return html`${content}<zone name="rhs">{previewButton}</zone>`;
    }

    renderPreviewButton() {
        return html`<icon-button class="imageItem__previewButtonRhs" icon="visibility">
            <zone name="tooltip-content">${this.i18n('lblPreview')}</zone>
        </icon-button>`;
    }
    

    async _initializeNodes() {
        await super._initializeNodes();
        const previewButton = this.querySelector('.imageItem__previewButtonRhs button');
        previewButton?.addEventListener('click', () => {
            /** @type {HTMLButtonElement | null} */
            const btn = this.querySelector('.image__previewButton');
            btn?.click();
        });
        return true;
    }

    // onEdit() {
    //     const items = [{ title: this._config?.title, image: this._config.url }];
    //     GalleryDialog.openEditor(items);
    // }
}

defineCustomElement('image-item', ImageItem);

export default ImageItem;
