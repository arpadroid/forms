/**
 * @typedef {import('./fileItem.types').FileItemConfigType} FileItemConfigType
 * @typedef {import('../../fileField.js').default} FileField
 * @typedef {import('../../fileField.types').FileFieldConfigType} FileFieldConfigType
 * @typedef {import('./fileItem.types').FileItemPayloadType} FileItemPayloadType
 */

import { mergeObjects, processFile, render, formatBytes, getFileType, getFileIcon, defineCustomElement } from '@arpadroid/tools';
import { I18n } from '@arpadroid/i18n';
import { ListItem } from '@arpadroid/lists';

const html = String.raw;
class FileItem extends ListItem {
    /** @type {FileItemConfigType} */
    _config = this._config;
    //////////////////////////
    // #region INITIALIZATION
    //////////////////////////

    _initialize() {
        super._initialize();
        this.bind('onDelete', 'onEdit');
    }

    /**
     * Returns the default config for the file item.
     * @returns {FileItemConfigType}
     */
    getDefaultConfig() {
        /** @type {FileItemConfigType} */
        const config = {
            icon: undefined,
            hasIcon: true,
            // onDelete: true,
            // onEdit: false,
            lblRemoveFile: I18n.getText('forms.fields.file.lblRemoveFile')
        };
        return mergeObjects(super.getDefaultConfig(), config);
    }

    _initializeFile() {
        const src = this.getProperty('src');
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

    // #endregion

    //////////////////////
    // #region LIFECYCLE
    /////////////////////

    _preRender() {
        const ext = this.payload?.extension;
        typeof ext === 'string' && (this.fileType = getFileType(ext));
        this.addTypeClass();
        !this.getProperty('icon') && this.getProperty('has-icon') && (this._config.icon = getFileIcon(String(ext)));
    }

    addTypeClass(fileType = this.fileType || 'file') {
        this.classList.add(`fileItem--type--${fileType}`);
    }

    async connectedCallback() {
        /** @type {FileField | null} */
        this.field = this.closest('.arpaField');
        /** @type {FileFieldConfigType} */
        this.fieldConfig = this.field?._config ?? {};
        await this._initializeFile();

        super.connectedCallback();
        this.classList.add('fileItem');
    }

    getFileType() {
        const ext = String(this.payload?.extension || '');
        return getFileType(ext);
    }

    // #endregion

    /////////////////////
    // #region ACCESSORS
    ////////////////////

    getTitle() {
        return this.payload?.title || super.getTitle();
    }

    hasEditButton() {
        return Boolean(this.fieldConfig?.onEdit || this._config.onEdit);
    }

    getSize() {
        return this.payload?.size || this.getProperty('size');
    }

    getReadableSize(size = this.getSize()) {
        if (Number(size).toString() === size) {
            return formatBytes(size);
        }
        if (typeof size === 'string') {
            return size;
        }
    }

    getBytes() {
        const size = this.getSize();
        return Number(size.replace(/\D/g, ''));
    }

    getExtension() {
        return this.payload?.extension || '';
    }

    // #endregion

    //////////////////
    // #region RENDER
    //////////////////

    getTemplateVars() {
        return {
            ...super.getTemplateVars(),
            size: this.getReadableSize(),
            extension: this.renderExtension(),
            metaData: this.renderMetadata()
        };
    }

    renderTitleContent(title = this.getTitle() || '', titleIcon = this.getProperty('title-icon')) {
        return html`
            <div class="fileItem__titleContent">
                ${(titleIcon && html`<arpa-icon>${titleIcon}</arpa-icon>`) || ''}
                <span class="fileItem__name">${title}</span>
            </div>
            {extension} {metaData}
        `;
    }

    renderExtension(extension = this.getExtension()) {
        return (extension && html`<span class="fileItem__extension">.${extension}</span>`) || '';
    }

    renderMetadata(size = this.getReadableSize()) {
        if (!size) return '';
        return html`<div class="fileItem__metadata">
            <span class="fileItem__size tag">${size}</span>
        </div>`;
    }

    renderRhs() {
        const { rhsContent = '' } = this._config;
        return super.renderRhs(`${rhsContent}${this.renderDeleteButton()}${this.renderEditButton()}`);
    }

    renderEditButton() {
        return render(this.hasEditButton(), html`<icon-button icon="edit" class="fileItem__editButton"></icon-button>`);
    }

    renderDeleteButton(fieldOnDelete = this.fieldConfig?.onDelete, onDelete = this._config?.onDelete) {
        return render(
            Boolean(fieldOnDelete || onDelete),
            html`<icon-button
                variant="delete"
                class="fileItem__deleteButton iconButton--small"
                tooltip="${this.getProperty('lbl-remove-file')}"
            ></icon-button>`
        );
    }

    // #endregion

    async _initializeNodes() {
        await super._initializeNodes();
        this._initializeDeleteButton();
        this._initializeEditButton();
        return true;
    }

    _initializeEditButton() {
        this.editButtonNode = this.querySelector('.fileItem__editButton');
        this.editButtonNode?.addEventListener('click', this.onEdit);
    }

    _initializeDeleteButton() {
        this.deleteButtonNode = this.querySelector('.fileItem__deleteButton');
        this.deleteButtonNode?.addEventListener('click', this.onDelete);
    }

    //////////////////////////////
    // #region EVENTS
    /////////////////////////////

    onDelete() {
        const fieldOnDelete = this.fieldConfig?.onDelete;
        const onDelete = this._config.onDelete;
        if (typeof onDelete === 'function') {
            onDelete(this);
        }
        if (typeof fieldOnDelete === 'function') {
            /** @type {Promise<unknown> | undefined} */
            const promise = /** @type {Promise<unknown> | undefined} */ (fieldOnDelete(this));
            if (promise instanceof Promise) {
                return promise.then(() => this.delete());
            }
            if (promise !== false) {
                this.delete();
            }
            return promise;
        }
        // this.remove();
    }

    onEdit() {
        const onEdit = this._config?.onEdit;
        if (typeof onEdit === 'function') {
            onEdit(this);
        }
        const fieldOnEdit = this.fieldConfig?.onEdit;
        if (typeof fieldOnEdit === 'function') {
            fieldOnEdit(this);
        }
    }

    // #endregion
}

defineCustomElement('file-item', FileItem);

export default FileItem;
