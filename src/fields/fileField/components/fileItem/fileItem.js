/**
 * @typedef {import('./fileItem.types').FileItemConfigType} FileItemConfigType
 * @typedef {import('../../fileField.js').default} FileField
 * @typedef {import('@arpadroid/ui').IconButton} IconButton
 * @typedef {import('../../fileField.types').FileFieldConfigType} FileFieldConfigType
 * @typedef {import('./fileItem.types').FileItemPayloadType} FileItemPayloadType
 */

import { mergeObjects, processFile, formatBytes, getFileType, getFileIcon, defineCustomElement } from '@arpadroid/tools';
import { ListItem } from '@arpadroid/lists';

const html = String.raw;
class FileItem extends ListItem {
    /** @type {FileItemConfigType} */
    _config = this._config;
    /**
     * Returns the default config for the file item.
     * @returns {FileItemConfigType}
     */
    getDefaultConfig() {
        this.bind('$onDelete');
        this.i18nKey = 'forms.fields.file';
        const superConfig = super.getDefaultConfig();
        /** @type {FileItemConfigType} */
        const config = {
            icon: 'attach_file',
            hasIcon: true,
            blueprint: ListItem.prototype.$renderTemplate.bind(this),
            classNames: ['fileItem', () => (this.fileType && `fileItem--type--${this.fileType}`) || ''],
            lblRemoveFile: '{i18n:lblRemoveFile}',
            lblEditFile: '{i18n:lblEditFile}',
            hasDelete: true,
            hasEdit: false,
            nodesConfig: {
                content: { canRender: false }
            }
        };
        return mergeObjects(superConfig, config);
    }

    getFileType() {
        return getFileType(String(this.payload?.extension || ''));
    }

    hasEdit() {
        return Boolean(this.fieldConfig?.onEdit || this.getProp('hasEdit'));
    }

    hasDelete() {
        return Boolean(this.fieldConfig?.onDelete || this.getProp('hasDelete'));
    }

    getReadableSize(size = this.getProp('size')) {
        return Number(size).toString() === size ? formatBytes(size) : size;
    }

    _initializeFile() {
        const src = this.getProp('src');
        if (typeof src === 'string') {
            const fileName = String(src?.split('/').pop() || '');
            /** @type {FileItemPayloadType} */
            this.payload = processFile({ name: fileName });
        }
        if (this._config.file instanceof File) {
            /** @type {FileItemPayloadType} */
            this.payload = processFile(this._config.file);
        }
    }

    _preRender() {
        super._preRender();
        const ext = this.getProp('extension');
        typeof ext === 'string' && (this.fileType = getFileType(ext));
        if (!this.getProp('icon') && this.getProp('hasIcon')) {
            this._config.icon = getFileIcon(String(ext));
        }
    }

    canRenderRhs() {
        return super.canRenderRhs() || this.hasDelete() || this.hasEdit();
    }

    /**
     * Returns the template for the list item.
     * @returns {string}
     */
    $renderTemplate() {
        return html`
            {main} {rhs}
            <arpa-zone name="title" replace-content>
                <div class="fileItem__titleContent">
                    {titleIcon}
                    <span class="fileItem__name">${this.getProp('title')}</span>
                </div>
                <span class="fileItem__extensionWrapper">
                    .
                    <arpa-node tag="span" name="extension" class="fileItem__extension"></arpa-node>
                </span>
                <arpa-node name="metadata" class="fileItem__metadata" can-render>
                    <span class="fileItem__size tag">{getReadableSize()}</span>
                </arpa-node>
            </arpa-zone>
            <arpa-zone name="rhs">
                <arpa-node
                    tag="icon-button"
                    can-render="hasDelete()"
                    name="deleteButton"
                    variant="delete"
                    class="iconButton--small"
                    on-click="{$onDelete}"
                    tooltip="{i18n:lblRemoveFile}"
                ></arpa-node>
                <arpa-node
                    tag="icon-button"
                    icon="edit"
                    name="editButton"
                    can-render="hasEdit()"
                    on-click="{$onEdit}"
                    tooltip="{i18n:lblEditFile}"
                ></arpa-node>
            </arpa-zone>
        `;
    }

    async connectedCallback() {
        /** @type {FileField | null} */
        this.field = this.closest('.arpaField');
        /** @type {FileFieldConfigType} */
        this.fieldConfig = this.field?.getConfig();
        await this._initializeFile();
        super.connectedCallback();
    }

    async $onDelete() {
        const fieldOnDelete = this.fieldConfig?.onDelete;
        this._config?.onDelete?.(this);
        if (typeof fieldOnDelete === 'function') {
            const rv = await fieldOnDelete(this);
            rv !== false && this.delete();
            if (rv !== true) {
                return rv;
            }
        }
        this.remove();
    }

    $onEdit() {
        this._config?.onEdit?.(this);
        this.fieldConfig?.onEdit?.(this);
    }

    // #endregion
}

defineCustomElement('file-item', FileItem);

export default FileItem;
