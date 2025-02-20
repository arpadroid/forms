import { defineCustomElement, mergeObjects } from '@arpadroid/tools';
import ImageItem from '../imageItem/imageItem.js';
import FileList from '../../../fileField/components/fileList/fileList.js';

class ImageList extends FileList {
    getDefaultConfig() {
        return mergeObjects(super.getDefaultConfig(), {
            className: 'fileList',
            hasResource: true,
            itemComponent: ImageItem
        });
    }
}

defineCustomElement('image-list', ImageList);

export default ImageList;
