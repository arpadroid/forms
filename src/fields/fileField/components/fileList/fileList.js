import { mergeObjects, mechanize } from '@arpadroid/tools';
import FileItem from '../fileItem/fileItem.js';
import { List } from '@arpadroid/lists';
class FileList extends List {
    getDefaultConfig(config = {}) {
        return mergeObjects(
            super.getDefaultConfig({
                className: 'fileList',
                hasResource: true,
                hasControls: false,
                itemComponent: FileItem,
                itemTag: 'file-item',
                mapItemId: ({ file }) => mechanize(`${file.name}-${file.size}`)
            }),
            config
        );
    }
}

customElements.define('file-list', FileList);

export default FileList;
