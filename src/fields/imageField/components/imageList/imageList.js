import { mergeObjects } from '@arpadroid/tools';
import ImageItem from '../imageItem/imageItem.js';

class ImageList extends window.arpadroid.ui.List {
    getDefaultConfig() {
        return mergeObjects(super.getDefaultConfig(), {
            className: 'fileList',
            itemComponent: ImageItem
        });
    }
}

customElements.define('image-list', ImageList);

export default ImageList;
