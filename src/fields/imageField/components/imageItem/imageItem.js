/** @typedef {import('./imageItem.types').ImageItemConfigType} ImageItemConfigType */

import FileItem from '../../../fileField/components/fileItem/fileItem.js';
import { defineCustomElement, mergeObjects } from '@arpadroid/tools';
// import GalleryDialog from '../../../../../../gallery/components/galleryDialog/galleryDialog.js';

class ImageItem extends FileItem {
    /** @type {ImageItemConfigType} */ // @ts-ignore
    _config = this._config;
    /**
     * Returns the default config for the file item.
     * @returns {ImageItemConfigType}
     */
    getDefaultConfig() {
        return mergeObjects(super.getDefaultConfig(), {
            icon: '',
            hasIcon: false,
            width: 100,
            height: 100
        });
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

    // onEdit() {
    //     const items = [{ title: this._config?.title, image: this._config.url }];
    //     GalleryDialog.openEditor(items);
    // }
}

defineCustomElement('image-item', ImageItem);

export default ImageItem;
