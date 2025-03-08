/**
 * @typedef {import('@arpadroid/tools').FilePayloadType} FilePayloadType
 * @typedef {import('../fileItem/fileItem.types').FileItemConfigType} FileItemConfigType
 */
import { mergeObjects, mechanize, defineCustomElement } from '@arpadroid/tools';
import FileItem from '../fileItem/fileItem.js';
import { List } from '@arpadroid/lists';
class FileList extends List {
    /** @type {() => FileItemConfigType[]} */
    getItems = this.getItems;
    /** @type {(payload: FileItemConfigType) => FileItem | undefined} */ // @ts-ignore
    addItem = this.addItem;
    /** @type {(items: FileItem[]) => any} */
    addItemNodes = this.addItemNodes;

    getDefaultConfig(config = {}) {
        return mergeObjects(
            super.getDefaultConfig({
                className: 'fileList',
                hasResource: true,
                hasControls: false,
                itemComponent: FileItem,
                itemTag: 'file-item',
                mapItemId: payload => {
                    const file = /** @type {File} */ (payload.file);
                    return mechanize(`${file.name}-${file.size}`);
                }
            }),
            config
        );
    }
}

defineCustomElement('file-list', FileList);

export default FileList;
