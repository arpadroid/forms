/**
 * @typedef {import('./fileItemInterface').FileItemInterface} FileItemInterface
 * @typedef {import('../../fileField.js').default} FileField
 */

import { ListItem } from '@arpadroid/ui';
import { mergeObjects, processFile, render } from '@arpadroid/tools';

const html = String.raw;
class FileItem extends ListItem {
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
            icon: 'text_snippet',
            onDelete: true,
            onEdit: false
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

    /**
     * Custom Elements.
     */

    async connectedCallback() {
        /** @type {FileField} */
        this.field = this.closest('.arpaField');
        this.fieldConfig = this.field?._config ?? {};
        await this._initializeFile();
        super.connectedCallback();
        this.classList.add('fileItem');
    }

    /**
     * Accessors.
     */

    getTitle() {
        return this.payload?.title || super.getTitle();
    }

    hasEditButton() {
        return Boolean(this.fieldConfig.onEdit || this._config.onEdit);
    }

    /**
     * Rendering.
     */

    getTemplateVars() {
        return {
            ...super.getTemplateVars(),
            size: this.payload?.size,
            extension: this.payload?.extension,
            metaData: this.renderMetadata()
        };
    }

    renderTitleContent(title = this.getTitle()) {
        return html`
            <div class="filteItem__titleContent">
                <arpa-icon>{titleIcon}</arpa-icon>
                <span class="fileItem__name">${title}</span>
                <span class="fileItem__extension">.{extension}</span>
            </div>
            {metaData}
        `;
    }

    renderMetadata(size = this.payload?.size) {
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
        return render(
            this.hasEditButton(),
            html`<button is="icon-button" icon="edit" class="fileItem__editButton"></button>`
        );
    }

    renderDeleteButton(fieldOnDelete = this.fieldConfig.onDelete, onDelete = this._config.onDelete) {
        return render(
            Boolean(fieldOnDelete || onDelete),
            html`<button is="icon-button" variant="delete" class="fileItem__deleteButton"></button>`
        );
    }

    /**
     * Nodes.
     */

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

    /**
     * Actions.
     */

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
                this.remove();
            }
            return promise;
        }
        this.remove();
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
}

customElements.define('file-item', FileItem);

export default FileItem;
