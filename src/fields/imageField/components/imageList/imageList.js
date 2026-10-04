/**
 * @typedef {import('./imageList.types.js').ImageListConfigType} ImageListConfigType
 */
import { defineCustomElement, mergeObjects } from '@arpadroid/tools';
import ImageItem from '../imageItem/imageItem.js';
import FileList from '../../../fileField/components/fileList/fileList.js';

class ImageList extends FileList {
    /** @type {ImageListConfigType} */
    _config = this._config;

    getDefaultConfig() {
        /** @type {ImageListConfigType} */
        const conf = {
            hasResource: true,
            itemTag: 'image-item',
            itemComponent: ImageItem
        };
        return mergeObjects(super.getDefaultConfig(), conf);
    }
}

defineCustomElement('image-list', ImageList);

export default ImageList;
