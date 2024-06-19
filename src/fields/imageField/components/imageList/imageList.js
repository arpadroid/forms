import { mergeObjects } from '@arpadroid/tools';
import ImageItem from '../imageItem/imageItem.js';
import { List } from '@arpadroid/ui';

class ImageList extends List {
    getDefaultConfig() {
        return mergeObjects(super.getDefaultConfig(), {
            className: 'fileList',
            itemComponent: ImageItem
        });
    }
}

customElements.define('image-list', ImageList);

export default ImageList;
