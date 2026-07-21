/**
 * @typedef {import('./searchField.types').SearchFieldConfigType} SearchFieldConfigType
 * @typedef {import('@arpadroid/ui').IconButton} IconButton
 */
import { I18n } from '@arpadroid/i18n';
import Field from '../field/field.js';
import { defineCustomElement, mergeObjects, prepend, render, renderNode } from '@arpadroid/tools';

const html = String.raw;

class SearchField extends Field {
    /** @type {SearchFieldConfigType} */
    _config = this._config;
    preventOnSubmit = false;

    /**
     * Returns the default configuration for the search field.
     * @returns {SearchFieldConfigType}
     */
    getDefaultConfig() {
        this._callOnSubmit = this._callOnSubmit.bind(this);
        /** @type {SearchFieldConfigType} */
        const conf = {
            classNames: ['searchField', 'fieldComponent'],
            icon: 'search',
            variant: 'default',
            placeholder: I18n.getText('common.labels.lblSearch'),
            inputAttributes: { type: 'search' }
        };
        return mergeObjects(super.getDefaultConfig(), conf);
    }

    getFieldType() {
        return 'search';
    }

    async $initialize() {
        const { variant } = this._config;
        super.$initialize();
        if (variant === 'mini') {
            this._config.iconRight = undefined;
        }
    }

    getVariant() {
        return this.getProp('variant');
    }

    getIconRight() {
        return this.getVariant() === 'mini' ? undefined : this.getProp('icon-right');
    }

    async $onInitialized() {
        await super.$onInitialized();
        this.classList.add('searchField', `searchField--${this.getVariant()}`);
        this.handleMiniButton();
    }

    handleMiniButton() {
        if (!this.miniButton) {
            this.miniButton = /** @type {IconButton} */ (renderNode(this.renderMiniButton()));
        }
        if (this.miniButton) {
            this.miniButton.removeEventListener('click', this._callOnSubmit);
            this.miniButton.addEventListener('click', this._callOnSubmit);
            this.bodyNode instanceof HTMLElement && prepend(this.bodyNode, this.miniButton);
        }
    }
    /**
     * Renders the mini button for the search field.
     * @returns {string} The mini button element.
     */
    renderMiniButton() {
        return render(this.getVariant() === 'mini', html`<icon-button icon="search" class="searchField__button"></icon-button>`);
    }

    /**
     * Calls the configured onSubmit function.
     * @param {Event} event - The event object.
     */
    _callOnSubmit(event) {
        const { onSubmit } = this._config;
        if (typeof onSubmit === 'function') {
            onSubmit(String(this.getValue() || ''), event);
        }
    }
}

defineCustomElement('search-field', SearchField);

export default SearchField;
