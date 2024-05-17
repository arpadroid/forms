import { I18n } from '@arpadroid/i18n';
import Field from '../field/field.js';
import { mergeObjects, prepend, render, renderNode } from '@arpadroid/tools';

const html = String.raw;
class SearchField extends Field {
    preventOnSubmit = false;
    getDefaultConfig() {
        this._callOnSubmit = this._callOnSubmit.bind(this);
        return mergeObjects(super.getDefaultConfig(), {
            className: 'searchField fieldComponent',
            icon: 'search',
            variant: 'default',
            inputAttributes: {
                placeholder: I18n.getText('common.labels.lblSearch'),
                type: 'search'
            }
        });
    }

    getFieldType() {
        return 'search';
    }

    getTagName() {
        return 'search-field';
    }

    _initialize() {
        const { variant } = this._config;
        super._initialize();
        if (variant === 'mini') {
            this._config.iconRight = undefined;
        }
    }

    getIconRight() {
        return this.getVariant() === 'mini' ? undefined : this.getProperty('icon-right');
    }

    async _onInitialized() {
        await super._onInitialized();
        this.classList.add('searchField', `searchField--${this.getVariant()}`);
        this.handleMiniButton();
    }

    handleMiniButton() {
        if (!this.miniButton) {
            this.miniButton = renderNode(this.renderMiniButton());
        }
        if (this.miniButton) {
            this.miniButton.removeEventListener('click', this._callOnSubmit);
            this.miniButton.addEventListener('click', this._callOnSubmit);
            prepend(this.bodyNode, this.miniButton);
        }
    }

    renderMiniButton() {
        return render(
            this.getVariant() === 'mini',
            html`<button is="icon-button" icon="search" class="searchField__button"></button>`
        );
    }

    _callOnSubmit(event) {
        const { onSubmit } = this._config;
        if (typeof onSubmit === 'function') {
            onSubmit(this.getValue(), event);
        }
    }
}

customElements.define('search-field', SearchField);

export default SearchField;
