import { List } from '@arpadroid/ui';
import { mergeObjects } from '@arpadroid/tools';
import FileItem from '../fileItem/fileItem.js';

class FileList extends List {
    getDefaultConfig() {
        return mergeObjects(super.getDefaultConfig(), {
            className: 'fileList',
            heading: 'Files',
            itemComponent: FileItem,
        });
    }
}

customElements.define('file-list', FileList);

export default FileList;
