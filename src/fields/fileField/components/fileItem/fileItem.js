/**
 * @typedef {import('./fileItemInterface').FileItemInterface} FileItemInterface
 * @typedef {import('../../fileField.js').default} FileField
 */

import { mergeObjects, processFile, render, formatBytes, getFileType, getFileIcon } from '@arpadroid/tools';
import { I18n } from '@arpadroid/i18n';
import { ListItem } from '@arpadroid/lists';

const html = String.raw;
class FileItem extends ListItem {
    //////////////////////////
    // #region INITIALIZATION
    //////////////////////////

    /**
     * Creates a new file item.
     * @param {FileItemInterface} config - The configuration object.
     * @param {Record<string, unknown>} payload - The file object.
     * @param {Record<string, string>} map
     * @returns {void}
     */
    constructor(config, payload, map) {
        super(config, payload, map);
        this.onDelete = this.onDelete.bind(this);
        this.onEdit = this.onEdit.bind(this);
    }

    /**
     * Returns the default config for the file item.
     * @returns {FileItemInterface}
     */
    getDefaultConfig() {
        return mergeObjects(super.getDefaultConfig(), {
            icon: undefined,
            hasIcon: true,
            onDelete: true,
            onEdit: false,
            lblRemoveFile: I18n.getText('forms.fields.file.lblRemoveFile')
        });
    }

    _initializeFile() {
        const src = this.getProperty('src');
        if (typeof src === 'string') {
            this.payload = processFile({ name: src.split('/').pop() });
        }
        if (this._config.file instanceof File) {
            this.payload = processFile(this._config.file);
        }
    }

    // #endregion

    //////////////////////
    // #region LIFECYCLE
    /////////////////////

    _preRender() {
        const ext = this.payload?.extension;
        this.fileType = getFileType(ext);
        this.addTypeClass();
        !this.getProperty('icon') && this.getProperty('has-icon') && (this._config.icon = getFileIcon(ext));
    }

    addTypeClass(fileType = this.fileType || 'file') {
        this.classList.add(`fileItem--type--${fileType}`);
    }

    async connectedCallback() {
        /** @type {FileField} */
        this.field = this.closest('.arpaField');
        this.fieldConfig = this.field?._config ?? {};
        await this._initializeFile();

        super.connectedCallback();
        this.classList.add('fileItem');
    }

    getFileType() {
        return getFileType(this.payload.extension);
    }

    // #endregion

    /////////////////////
    // #region ACCESSORS
    ////////////////////

    getTitle() {
        return this.payload?.title || super.getTitle();
    }

    hasEditButton() {
        return Boolean(this.fieldConfig.onEdit || this._config.onEdit);
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

    // #endregion

    //////////////////
    // #region RENDER
    //////////////////

    getTemplateVars() {
        return {
            ...super.getTemplateVars(),
            size: this.getReadableSize(),
            extension: this.payload?.extension,
            metaData: this.renderMetadata()
        };
    }

    renderTitleContent(title = this.getTitle()) {
        return html`
            <div class="fileItem__titleContent">
                <arpa-icon>{titleIcon}</arpa-icon>
                <span class="fileItem__name">${title}</span>
            </div>
            <span class="fileItem__extension">.{extension}</span>
            {metaData}
        `;
    }

    renderMetadata(size = this.getReadableSize()) {
        return render(
            size,
            html`
                <div class="fileItem__metadata">
                    <span class="fileItem__size tag">${size}</span>
                </div>
            `
        );
    }

    renderRhs() {
        const { rhsContent = '' } = this._config;
        return super.renderRhs(`${rhsContent}${this.renderDeleteButton()}${this.renderEditButton()}`);
    }

    renderEditButton() {
        return render(this.hasEditButton(), html`<button is="icon-button" icon="edit" class="fileItem__editButton"></button>`);
    }

    renderDeleteButton(fieldOnDelete = this.fieldConfig.onDelete, onDelete = this._config.onDelete) {
        return render(
            Boolean(fieldOnDelete || onDelete),
            html`<button
                is="icon-button"
                variant="delete"
                class="fileItem__deleteButton iconButton--small"
                label="${this.getProperty('lbl-remove-file')}"
            ></button>`
        );
    }

    // #endregion

    _initializeNodes() {
        super._initializeNodes();
        this._initializeDeleteButton();
        this._initializeEditButton();
    }

    _initializeEditButton() {
        this.editButtonNode = this.querySelector('.fileItem__editButton');
        this.editButtonNode?.addEventListener('click', this.onEdit);
    }

    _initializeDeleteButton() {
        this.deleteButtonNode = this.querySelector('.fileItem__deleteButton');
        this.deleteButtonNode?.addEventListener('click', this.onDelete);
    }
    //////////////////
    // #region EVENTS
    /////////////////

    onDelete() {
        const fieldOnDelete = this.fieldConfig.onDelete;
        const onDelete = this._config.onDelete;
        if (typeof onDelete === 'function') {
            onDelete(this);
        }
        if (typeof fieldOnDelete === 'function') {
            const promise = fieldOnDelete(this);
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
        const onEdit = this._config.onEdit;
        if (typeof onEdit === 'function') {
            onEdit(this);
        }
        const fieldOnEdit = this.fieldConfig.onEdit;
        if (typeof fieldOnEdit === 'function') {
            fieldOnEdit(this);
        }
    }

    // #endregion
}

customElements.define('file-item', FileItem);

export default FileItem;
