import { mergeObjects } from '@arpadroid/tools';
import FileItem from '../fileItem/fileItem.js';
class FileList extends window.arpadroid.ui.List {
    getDefaultConfig() {
        return mergeObjects(super.getDefaultConfig(), {
            className: 'fileList',
            itemComponent: FileItem,
        });
    }
}

customElements.define('file-list', FileList);

export default FileList;
