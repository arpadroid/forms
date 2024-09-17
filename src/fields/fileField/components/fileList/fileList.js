import { mergeObjects } from '@arpadroid/tools';
import FileItem from '../fileItem/fileItem.js';
import { List } from '@arpadroid/lists';
class FileList extends List {
    getDefaultConfig() {
        return mergeObjects(super.getDefaultConfig(), {
            className: 'fileList',
            hasResource: true,
            itemComponent: FileItem
        });
    }
}

customElements.define('file-list', FileList);

export default FileList;
