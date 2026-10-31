/**
 * @typedef {import('./fileList.types').FileListConfigType} FileListConfigType
 * @typedef {import('@arpadroid/tools').FilePayloadType} FilePayloadType
 * @typedef {import('../fileItem/fileItem.types').FileItemConfigType} FileItemConfigType
 */
import { mergeObjects, mechanize, defineCustomElement } from '@arpadroid/tools';
import FileItem from '../fileItem/fileItem.js';
import { List } from '@arpadroid/lists';
class FileList extends List {
    /** @type {() => FileItemConfigType[]} */
    getItems = this.getItems;
    /** @type {(payload: FileItemConfigType) => FileItem} */
    addItem = this.addItem;
    /** @type {(items: FileItem[]) => any} */
    addItemNodes = this.addItemNodes;

    /** @type {FileListConfigType} */
    _config = this._config;

    /**
     * Returns the default configuration for this component.
     * @returns {FileListConfigType}
     */
    getDefaultConfig() {
        /** @type {FileListConfigType} */
        const conf = {
            className: 'fileList',
            hasResource: true,
            hasControls: false,
            itemComponent: FileItem,
            itemTag: 'file-item',
            controls: [],
            mapItemId: payload => {
                const file = /** @type {File} */ (payload.file || {});
                const name = payload?.name || file?.name || 'file';
                const size = file.size || payload?.size || '';
                let id = name;
                if (size) id += `-${size}`;
                return mechanize(id.replace(/\./g, '-'));
            }
        };
        return mergeObjects(super.getDefaultConfig(), conf);
    }
}

defineCustomElement('file-list', FileList);

export default FileList;
