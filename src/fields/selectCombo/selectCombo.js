/* eslint-disable sonarjs/no-duplicate-string */
/**
 * @typedef {import('./selectOption/selectOption.js').default} SelectOption
 * @typedef {import('../optionsField/optionsFieldInterface.js').OptionsFieldInterface} OptionsFieldInterface
 * @typedef {import('./selectComboInterface.js').SelectComboInterface} SelectComboInterface
 */
import { mergeObjects, addSearchMatchMarkers, SearchTool, attrString } from '@arpadroid/tools';
import SelectField from '../selectField/selectField.js';
import { I18n } from '@arpadroid/i18n';
import { InputCombo } from '@arpadroid/ui';

const html = String.raw;
class SelectCombo extends SelectField {
    //////////////////////////
    // #region INITIALIZATION
    //////////////////////////

    /**
     * Returns the default configuration for the select combo field.
     * @returns {SelectComboInterface} The default configuration object.
     */
    getDefaultConfig() {
        this.bind('onLabelClick', 'onSearch', 'onOpenCombo', 'onCloseCombo', 'onSearchInputFocus', 'onSearchInputBlur');
        return mergeObjects(super.getDefaultConfig(), {
            hasSearch: false,
            debounceSearch: 500,
            searchItemContentSelector: '.fieldOption__label, .fieldOption__subTitle',
            placeholder: I18n.getText('forms.fields.selectCombo.lblNoSelection'),
            optionsPosition: 'bottom-left',
            inputTemplate: html`
                {input}
                <div class="selectCombo__options optionsField__options comboBox">{options}</div>
            `,
            optionComponent: 'select-option'
        });
    }

    setValue(value) {
        super.setValue(value);
        this.updateValue();
        return this;
    }

    // #endregion

    ////////////////////
    // #region LIFECYCLE
    ////////////////////

    static get observedAttributes() {
        return ['value', 'has-search'];
    }

    /**
     * Handles attribute changes and updates the value if the 'value' attribute has changed.
     * @param {string} name - The name of the attribute that changed.
     * @param {string} oldValue
     * @param {string} newValue
     */
    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue === newValue) return;
        if (name === 'has-search') {
            this.reRender();
        }
    }

    reRender() {
        this.inputCombo = null;
        super.reRender();
    }

    _initializeNodes() {
        super._initializeNodes();
        this._initializeButtonInput();
        this._initializeSearchInput();
        this.optionsNode = this.querySelector('.selectCombo__options');
        this._initializeInputCombo();
        if (this.label) {
            this.label.removeEventListener('click', this.onLabelClick);
            this.label.addEventListener('click', this.onLabelClick);
        }
    }

    _initializeButtonInput() {
        this.buttonInput = this.querySelector('button.optionsField__input');
    }

    _initializeSearchInput() {
        this.searchInput = this.querySelector('input.optionsField__searchInput');
        if (this.searchInput) {
            this.searchInput.removeEventListener('focus', this.onSearchInputFocus);
            this.searchInput.addEventListener('focus', this.onSearchInputFocus);
            this.searchInput.removeEventListener('blur', this.onSearchInputBlur);
            this.searchInput.addEventListener('blur', this.onSearchInputBlur);
        }
        this._initializeSearch();
    }

    async _initializeSearch() {
        await this.onReady();
        if (this.searchInput && !this.search) {
            this.search = new SearchTool(this.searchInput, {
                container: this.optionsNode,
                searchSelector: this.getProperty('search-item-content-selector'),
                onSearch: this.onSearch,
                debounceDelay: this.getProperty('debounce-search')
            });
        }
    }

    /**
     * Initializes the input combo for the select combo field.
     * @protected
     */
    _initializeInputCombo() {
        const handler = this.getInput();
        if (handler) {
            if (!this.inputCombo?.input.isConnected) {
                this.optionsNode = this.querySelector('.selectCombo__options');
                this.inputCombo = new InputCombo(handler, this.optionsNode, {
                    containerSelector: this.getProperty('option-component'),
                    position: this.getProperty('options-position'),
                    closeOnClick: true,
                    onOpen: () => this.onOpenCombo(),
                    onClose: () => this.onCloseCombo()
                });
            } else {
                this.optionsNode = this.inputCombo?.combo;
            }
        }
    }

    // #endregion

    ////////////////////
    // #region ACCESSORS
    ////////////////////

    getFieldType() {
        return 'selectCombo';
    }

    getTagName() {
        return 'select-combo';
    }

    getInput() {
        return this.hasSearch() ? this.querySelector('.optionsField__searchInput') : this.querySelector('.optionsField__input');
    }

    getContentSelector() {
        return this.getProperty('search-item-content-selector');
    }

    hasSearch() {
        const { fetchOptions } = this._config;
        const hasSearch = this.hasAttribute('has-search') || this._config.hasSearch;
        return Boolean(hasSearch || (fetchOptions && !this.getOptionCount()));
    }

    setOptions(options) {
        super.setOptions(options);
        if (options.length && !this._initializedOptions) {
            this.updateValue();
            this._initializedOptions = true;
        }
        return this;
    }

    /**
     * Updates the value of the select combo field based on the selected option.
     */
    async updateValue() {
        await this.promise;
        await this.onReady();
        const { renderValue } = this._config;
        /** @type {SelectOption} */
        this.selectedOption = this.getSelectedOption();
        this.getOptions().forEach(option => option.removeAttribute('aria-selected'));
        this.selectedOption?.setAttribute('aria-selected', 'true');
        const configValue = typeof renderValue === 'function' && renderValue(this.selectedOption);
        const label =
            configValue || this.selectedOption?.getProperty('label') || this.selectedOption?.textContent || this.getPlaceholder();
        this.updateButtonLabel(label);
        this.updateSearchInputLabel(label);
    }

    updateButtonLabel(label) {
        if (this.buttonInput) {
            this.buttonInput.innerHTML = '';
            if (typeof label === 'string') {
                this.buttonInput.innerHTML = label;
            } else if (label instanceof HTMLElement) {
                this.buttonInput.appendChild(label);
            }
        }
    }

    updateSearchInputLabel(label) {
        if (this.searchInput) {
            this.searchInput.value = label?.textContent || label;
        }
    }

    // #endregion

    /////////////////////
    // #region RENDERING
    /////////////////////

    /**
     * Renders the input element of the select combo field.
     * @returns {string} The rendered input element.
     */
    getInputTemplateVars() {
        return {
            ...super.getInputTemplateVars(),
            input: this.renderComboInput()
        };
    }

    renderComboInput() {
        const placeholder = this.getPlaceholder();
        const inputAttributes = attrString({ placeholder });
        return this.hasSearch()
            ? html`<input id="${this.getHtmlId()}" type="text" class="optionsField__searchInput fieldInput" ${inputAttributes} />`
            : html`<button id="${this.getHtmlId()}" type="button" class="optionsField__input fieldInput">
                  ${this.getPlaceholder()}
              </button>`;
    }

    renderOptions(options) {
        super.renderOptions(options);
        requestAnimationFrame(() => this.inputCombo?.place());
    }

    // #endregion

    //////////////////
    // #region EVENTS
    /////////////////

    onLabelClick() {
        return this.getInput()?.focus();
    }

    onSearchInputFocus() {
        this.searchInput.select();
    }

    onSearchInputBlur() {
        this.searchInput.value = this.getSelectedOption()?.getProperty('label') || '';
    }

    onOpenCombo() {
        const { fetchOptions } = this._config;
        if (typeof fetchOptions === 'function' && this.query) {
            this.fetchOptions();
        }
    }

    onCloseCombo() {
        this.resetSearchState();
    }

    resetSearchState() {
        if (this.hasSearch()) {
            this.getOptions().forEach(node => {
                node.style.display = '';
                addSearchMatchMarkers(node, '', this.getContentSelector());
            });
        }
    }

    async onSearch({ query, event }) {
        if (event) {
            this.query = query;
        }
        const { fetchOptions } = this._config ?? {};
        if (fetchOptions) {
            if (event) {
                await this.fetchOptions(query);
            }
            requestAnimationFrame(() => {
                this.getOptions().forEach(node => {
                    addSearchMatchMarkers(node, query, this.getContentSelector());
                });
            });
            return false;
        }
    }

    // #endregion
}

customElements.define('select-combo', SelectCombo);

export default SelectCombo;
