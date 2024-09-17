import { mergeObjects } from '@arpadroid/tools';
import ImageItem from '../imageItem/imageItem.js';
import { List } from '@arpadroid/lists';

class ImageList extends List {
    getDefaultConfig() {
        return mergeObjects(super.getDefaultConfig(), {
            className: 'fileList',
            hasResource: true,
            itemComponent: ImageItem
        });
    }
}

customElements.define('image-list', ImageList);

export default ImageList;
